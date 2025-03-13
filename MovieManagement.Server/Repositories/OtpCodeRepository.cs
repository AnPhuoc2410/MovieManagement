using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;
using System.Threading.Tasks;

namespace MovieManagement.Server.Repositories
{
    public class OtpCodeRepository : GenericRepository<OtpCode>, IOtpCodeRepository
    {
        private readonly AppDbContext _context;
        public OtpCodeRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<OtpCode> CreateOtpCode(string email)
        {
            var newOtpCode = new OtpCode
            {
                Email = email,
                Code = new Random().Next(100000, 999999).ToString(),
                IsUsed = 0,
                ExpiredTime = DateTime.UtcNow.AddMinutes(5)
            };
            await _context.AddAsync(newOtpCode);
            _context.SaveChangesAsync();
            return newOtpCode;
        }
        public async Task<OtpCode> GetOtpCode(string email, string code)
        {
            var otpRecord = await _context.OtpCodes.Where(o => o.Email == email && o.Code == code).FirstOrDefaultAsync();
            return otpRecord;
        }

        public async Task<OtpCode> DeleteOtpCode(string email)
        {
         //Find the otp code 
            var otp = await _context.OtpCodes.FirstOrDefaultAsync(o => o.Email == email);

            if (otp == null)
            {
                return null; 
            }

            // Delete the OTP code
            _context.OtpCodes.Remove(otp);

            // Save changes to the database
            await _context.SaveChangesAsync();
            return otp;
        }
    }
}
