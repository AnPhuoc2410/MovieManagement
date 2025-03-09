using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        public Task<bool> IsExistingEmailAsync(string email);
        public Task<bool> IsExistingUserNameAsync(string userName);
        public Task<bool> ChangeUserPasswordByEmail(string email, string newPassword);
        public Task<List<User>> GetUserByRoleAsync(Role role);
    }
}
