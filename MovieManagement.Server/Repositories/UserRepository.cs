using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services.JwtService;

namespace MovieManagement.Server.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;

        }

        public async Task<bool> ChangeUserPasswordByEmail(string email, string newPassword)
        {
            var user = await _context.Users
                            .Where(user => user.Email == email)
                            .OrderBy(user => user.JoinDate)
                            .LastOrDefaultAsync();
            if (user == null)
            {
                return false;
            }
            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, user.Password);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
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

        public async Task<User> GetByEmail(string email)
        {
            var user = await _context.Users
                .Where(u => u.Email == email && u.Status == 1)
                .FirstOrDefaultAsync();

            return user;
        }

    }
}
