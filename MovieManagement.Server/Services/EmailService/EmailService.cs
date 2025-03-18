using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Extensions.ConvertFile;
using MovieManagement.Server.Extensions.QRCode;
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
        private readonly IQRCodeGenerator _qRCodeGenerator;
        private readonly IConfiguration _configuration;

        public EmailService(IUnitOfWork unitOfWork, IConfiguration configuration, IConvertFileService convertFile, QRCodeGenerator qRCodeGenerator)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _convertFile = convertFile;
            _qRCodeGenerator = qRCodeGenerator;
        }
        public async Task<bool> SendEmailReportBill(BillReportRequest billReport)
        {
            // Nhớ kiểm tra trạng thái của bill xem có phải đã thanh toán không

            //Get user bill
            var userBill = await _unitOfWork.BillRepository.GetByIdAsync(billReport.BillId);
            if (userBill == null)
                throw new NotFoundException("No bills found!");

            // Get user email
            string userEmail = (await _unitOfWork.UserRepository.GetByIdAsync(userBill.UserId)).Email;
            if (userEmail == null)
                throw new NotFoundException("No user found!");

            // Create email
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Eiga Cinema", _configuration["Account:AppEmail"]));
            message.To.Add(new MailboxAddress("", userEmail));
            message.Subject = "INVOICE";

            // Create body to assign message
            var bodyBuilder = new BodyBuilder();

            // Generate HTML body for the bill report
            string body = _convertFile.GenerateHtmlFromBillReport(billReport);
            bodyBuilder.HtmlBody = body;

            // Create QR code Stream
            byte[] qrCode = _qRCodeGenerator.GenerateQRCode(userBill.BillId.ToString());
            var qrStream = _qRCodeGenerator.GenerateQRCodeStream(qrCode);

            // Attach QR code to the email
            var attachment = new MimePart("image", "png")
            {
                Content = new MimeContent(qrStream),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = "QRCode_Cua_Don_Hang.png"
            };

            var multipart = new Multipart("mixed")
            {
                bodyBuilder.ToMessageBody(),
                attachment
            };

            message.Body = multipart;

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
