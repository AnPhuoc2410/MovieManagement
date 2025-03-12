using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using MimeKit.Text;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.JwtService;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace MovieManagement.Server.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;

        public EmailService(IUnitOfWork unitOfWork, IConfiguration configuration, IJwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _jwtService = jwtService;
        }

        public async Task<bool> sendAuthenticateEmail(string userEmail)
        {
            try
            {
                //Checking user existing
                var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(userEmail);
                if (user == null)
                    throw new NotFoundException("User cannot found!");

                //Generate jwt token
                var token = _jwtService.GenerateToken(user.UserId, user.UserName, user.Role.ToString());

                //Create activation link with jwt token
                var activationLink = $"{_configuration["BackEnd:BaseURL"]}/activate?token={token}";

                //Create email
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configuration["AuthenticateAccount:Username"]));
                email.To.Add(MailboxAddress.Parse(userEmail));
                email.Subject = "Activate your account";
                email.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<p>Click the link below to activate your account:</p> <a href='{activationLink}'>Activate Account</a>"
                };

                //Send email
                using var smtp = new SmtpClient();
                smtp.Connect(_configuration["AuthenticateAccount:Host"], 587, SecureSocketOptions.StartTls);
                smtp.Authenticate(_configuration["AuthenticateAccount:Username"], _configuration["AuthenticateAccount:Password"]);
                smtp.Send(email);
                smtp.Disconnect(true);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot send email because of this error " + ex.Message);
            }
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
