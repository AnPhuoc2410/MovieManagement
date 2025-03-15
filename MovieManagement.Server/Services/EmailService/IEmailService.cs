using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;

namespace MovieManagement.Server.Services.EmailService
{
    public interface IEmailService
    {
        public Task<bool> SendOtpEmail(string email);
        public Task<bool> ValidationOtp(string email, string password, string otp);
        public Task<bool> SendEmailReportBill(BillReportRequest billReport);
    }
}
