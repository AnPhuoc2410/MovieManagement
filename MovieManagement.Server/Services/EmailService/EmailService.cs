using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Extensions.ConvertFile;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using System.Collections.Concurrent;
using System.Text;
using System.Threading.Tasks;

namespace MovieManagement.Server.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConvertFileService _convertFile;
        private readonly IConfiguration _configuration;

        public EmailService(IUnitOfWork unitOfWork, IConfiguration configuration, IConvertFileService convertFile)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _convertFile = convertFile;
        }
        public async Task<bool> SendEmailReportBill(BillReportRequest billReport)
        {
            var userBill = await _unitOfWork.BillRepository.GetByIdAsync(billReport.BillId);
            if (userBill == null)
                throw new NotFoundException("No bills found!");

            //Get user email
            string userEmail = (await _unitOfWork.UserRepository.GetByIdAsync(userBill.UserId)).Email;
            if(userEmail == null)
                throw new NotFoundException("No user found!");

            // Create email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Eiga Cinema", _configuration["Account:AppEmail"]));
            message.To.Add(new MailboxAddress("", userEmail));
            message.Subject = "INVOICE";

            //Get html file
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Extensions", "BillReportTemplate", "BillReportTemplate.html");


            // If not found template file
            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Template file not found: {templatePath}");

            //Read template file
            var body = File.ReadAllText(templatePath);

            //Create list Products
            decimal total = 0;
            var ticketListHTML = new StringBuilder();
            var ticketDetails = await _unitOfWork.BillRepository.GetPurchasedTicketsForBill(userBill.BillId);
            foreach (var ticket in ticketDetails)
            {
                ticketListHTML.Append(_convertFile.GenerateHtmlFromBillReportTemplate(ticket));
                total += ticket.Price;
            }

            //Get discount of Bill
            decimal discount = 0;
            if (userBill.PromotionId != null)
            {
                var promotion = await _unitOfWork.PromotionRepository.GetByIdAsync(userBill.PromotionId.Value);
                discount = promotion.Discount;
            }

            //Replace template
            body = body
                .Replace("{{CreatedDate}}", billReport.CreatedDate.ToString("MMMM dd, yyyy", new System.Globalization.CultureInfo("en-US")))
                .Replace("{{TicketList}}", ticketListHTML.ToString())
                .Replace("{{Total}}", total.ToString())
                .Replace("{{Discount}}", discount.ToString())
                .Replace("{{Amount}}", billReport.Amount.ToString());



            //Assign body to message
            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            // Login to email and send message
            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_configuration["Account:AppEmail"], _configuration["Account:AppPassword"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
            return true;
        }
        public async Task<bool> SendOtpEmail(string userEmail)
        {
            try
            {
                //Checking user existing
                bool isExist = await _unitOfWork.UserRepository.IsExistingEmailAsync(userEmail);
                if (!isExist)
                    throw new NotFoundException("User cannot found!");

                //Create email
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Eiga Cinema", _configuration["Account:AppEmail"]));
                message.To.Add(new MailboxAddress("", userEmail));
                message.Subject = "Gửi mã xác thực OTP";

                var otpCode = await _unitOfWork.OtpCodeRepository.CreateOtpCode(userEmail);

                message.Body = new TextPart("plain")
                {
                    Text = $"{otpCode.Code}"
                };

                //Login to email and send message
                using var client = new SmtpClient();
                await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_configuration["Account:AppEmail"], _configuration["Account:AppPassword"]);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot send email because this error: " + ex.Message);
            }
        }
        public async Task<bool> ValidationOtp(string email, string password, string otp)
        {
            try
            {
                //Checking user is existing by email
                var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
                if (user == null)
                    throw new NotFoundException("User cannot found!");

                //Checking validation user
                var otpRecord = await _unitOfWork.OtpCodeRepository.GetOtpCode(email, otp);
                if (otpRecord == null)
                    throw new NotFoundException("User's OTP code is invalid");
                if (otpRecord.IsUsed == 1)
                    throw new Exception("This OTP is used!");
                if (otpRecord.ExpiredTime < DateTime.UtcNow)
                    throw new Exception("This OTP is expired!");

                //Xac nhan da su dung OTP
                otpRecord.IsUsed = 1;

                //Create HashPassword
                var passwordHasher = new PasswordHasher<User>();

                //Verify password
                //Xac thuc mat khau co trong database khong -> tranh viec Hashpassword 2 lan
                var verificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, password);

                //Hash new password
                password = passwordHasher.HashPassword(user, password);

                //Checking change password
                if (!await _unitOfWork.UserRepository.ChangeUserPasswordByEmailAsync(email, password))
                    throw new Exception("Password cannot change!");

                await _unitOfWork.OtpCodeRepository.UpdateAsync(otpRecord);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot send email because this error: " + ex.Message);
            }
        }
    }
}
