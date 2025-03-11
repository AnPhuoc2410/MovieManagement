using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services.JwtService;
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

            var users = _context.Users
                        .Where(user => user.Role == role)
                        .ToListAsync();

            return users;
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

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users
                 .Where(user => user.Email == email && user.Status != 0)
                 .OrderBy(user => user.JoinDate)
                 .LastOrDefaultAsync();
            return user;
        }
    }
}
