using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services.JwtService;
using static MovieManagement.Server.Models.Enums.BillEnum;
using static MovieManagement.Server.Models.Enums.TicketEnum;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;

        }

        public async Task<bool> ChangeUserPasswordByEmailAsync(string email, string newPassword)
        {
            var user = await _context.Users
                            .Where(user => user.Email == email)
                            .OrderBy(user => user.JoinDate)
                            .LastOrDefaultAsync();
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user!=null;
        }
        public Task<List<User>> GetUserByRoleAsync(Role role)
        {
            return _context.Users
                .Where(user => user.Role == role && user.Status == UserStatus.Active)
                .ToListAsync();
        }
        public async Task<bool> IsExistingEmailAsync(string email)
        {
            var user = await _context.Users
                            .Where(user => user.Email == email)
                            .OrderBy(user => user.JoinDate)
                            .LastOrDefaultAsync();
            return user != null;
        }
        public async Task<bool> IsExistingUserNameAsync(string userName)
        {
            var user = await _context.Users
                            .Where(user => user.UserName == userName)
                            .OrderBy(user => user.JoinDate)
                            .LastOrDefaultAsync();
            return user != null;
        }
        public async Task<bool> ResetUserPasswordByUserIdAsync(Guid userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users
                            .Where(user => user.UserId == userId)
                            .OrderBy(user => user.JoinDate)
                            .LastOrDefaultAsync();
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user!=null;
        }
        public User GetUserByUniqueFields(string email, string idCard, string phoneNumber, string userName)
        {
            return _context.Users
                .Where(user => user.Email == email || 
                               user.IDCard == idCard || 
                               user.PhoneNumber == phoneNumber || 
                               user.UserName == userName)
                .FirstOrDefault();
        }
        public bool IsFieldExisting(string fieldName, string fieldValue, Guid? excludeUserId = null)
        {
            var query = _context.Users.AsQueryable();

            // Dynamically construct the query based on the field name
            if (fieldName == "UserName")
                query = query.Where(user => user.UserName == fieldValue);
            else if (fieldName == "PhoneNumber")
                query = query.Where(user => user.PhoneNumber == fieldValue);

            if (excludeUserId.HasValue)
            {
                query = query.Where(user => user.UserId != excludeUserId.Value);
            }

            var user = query.OrderBy(user => user.JoinDate).LastOrDefault();
            return user != null;
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users
                 .Where(user => user.Email == email && user.Status != 0)
                 .OrderBy(user => user.JoinDate)
                 .LastOrDefaultAsync();
            return user;
        }

        public async Task<List<TopMemberResponse.MemberRevenue>> GetTopMemberRevenue()
        {
            var user = await _context.Users
                .Where(u => u.Role == Role.Member)
                .Select(u => new TopMemberResponse.MemberRevenue
                {
                    MemberName = u.UserName,
                    TicketsSold = u.Bills
                        .SelectMany(b => b.TicketDetails
                            .Where(td => td.Status == TicketStatus.Paid))
                        .Count(),
                    CurrentPoint = u.Point,
                    TotalPoint = u.Bills
                        .Where(b => b.Status == BillStatus.Completed)
                        .Sum(b => b.Point)
                })
                .OrderByDescending(u => u.TicketsSold)
                .Take(50)
                .ToListAsync();
            return user;
        }
    }
}
