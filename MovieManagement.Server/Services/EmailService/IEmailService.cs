using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.EmailService
{
    public interface IEmailService
    {
        public Task<bool> SendOtpEmail(string email);
        public Task<bool> ValidationOtp(string email, string password, string otp);
        public Task<bool> ActivateAccount(string email, string otp);
    }
}
