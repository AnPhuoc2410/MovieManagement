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
            return user != null;
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

        public async Task<bool> ResetUserPasswordByUserIdAsync(Guid userId, string currentPassword,
            string newPassword)
        {
            var user = await _context.Users
                .Where(user => user.UserId == userId)
                .OrderBy(user => user.JoinDate)
                .LastOrDefaultAsync();
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user != null;
        }
        
        public async Task<bool> ResetUserPasswordByEmailAsync(String email, string currentPassword,
            string newPassword)
        {
            var user = await _context.Users
                .Where(user => user.Email == email)
                .OrderBy(user => user.JoinDate)
                .LastOrDefaultAsync();
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user != null;
        }

        public User GetUserByUniqueFields(string email, string idCard, string phoneNumber,
            string userName)
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

        public async Task<List<User>> GetUsersByIdCardAsync(string idCard)
        {
            var users = await _context.Users
                .Where(user => user.IDCard.Contains(idCard)) // Use Contains for relative matching
                .OrderBy(user => user.JoinDate)
                .ToListAsync();
            return users;
        }

        public async Task<List<User>> GetUsersByPhoneAsync(string phone)
        {
            var users = await _context.Users
                .Where(user => user.PhoneNumber.Contains(phone)) // Use Contains for relative matching
                .OrderBy(user => user.JoinDate)
                .ToListAsync();
            return users;
        }

        public async Task<List<TopMemberResponse.MemberRevenue>> GetTopMemberRevenue()
        {
            var user = await _context.Users
                .Where(u => u.Role == Role.Member)
                .Select(u => new TopMemberResponse.MemberRevenue
                {
                    MemberName = u.UserName,
                    PurchasedTicket = u.Bills
                        .Where(b => b.Status == BillStatus.Completed)
                        .Select(b => b.TotalTicket)
                        .Sum(),
                    CurrentPoint = u.Point,
                    TotalPoint = u.Bills
                        .Where(b => b.Status == BillStatus.Completed)
                        .Sum(b => b.Point)
                })
                .OrderByDescending(u => u.PurchasedTicket)
                .Take(50)
                .ToListAsync();
            return user;
        }

        public async Task<List<TopMemberResponse.MemberDaily>> GetTopMemberDailyRevenue(
            DateTime date)
        {
            var user = await _context.Users
                .Where(u => u.Role == Role.Member)
                .Select(u => new TopMemberResponse.MemberDaily
                {
                    Day = date,
                    MemberRevenues = u.Bills
                        .Where(b =>
                            b.Status == BillStatus.Completed && b.CreatedDate.Day == date.Day)
                        .SelectMany(b => b.TicketDetails
                            .Where(td => td.Status == TicketStatus.Paid))
                        .GroupBy(td => td.Bill.CreatedDate.Day)
                        .Select(g => new TopMemberResponse.MemberRevenue
                        {
                            MemberName = u.UserName,
                            PurchasedTicket = u.Bills
                                .Select(b => b.TotalTicket)
                                .Sum(),
                            CurrentPoint = u.Point,
                            TotalPoint = u.Bills
                                .Sum(b => b.Point)
                        })
                        .ToList()
                })
                .OrderByDescending(u => u.MemberRevenues.Sum(mr => mr.PurchasedTicket))
                .Take(50)
                .ToListAsync();
            return user;
        }
    }
}