using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IOtpCodeRepository : IGenericRepository<OtpCode>
    {
        public Task<OtpCode> CreateOtpCode(string email);
        public Task<OtpCode> GetOtpCode(string email, string otp);
        public Task<OtpCode> DeleteOtpCode(string email);
    }
}
