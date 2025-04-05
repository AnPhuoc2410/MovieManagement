using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.EmailService
{
    public interface IEmailService
    {
        Task<String> SendOtpEmail(string email);
        Task<bool> ValidationOtp(string email, string otp);
        bool SendEmailReportBill(Guid billId);
    }
}
