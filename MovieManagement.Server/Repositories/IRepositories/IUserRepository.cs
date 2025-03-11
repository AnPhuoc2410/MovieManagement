using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<bool> IsExistingEmailAsync(string email);
        Task<bool> IsExistingUserNameAsync(string userName);
        Task<bool> ChangeUserPasswordByEmail(string email, string newPassword);
        Task<List<User>> GetUserByRoleAsync(Role role);
        Task<User> GetByIdAsync(Guid id);
        Task<User> GetByEmail(string email);
        public Task<bool> IsExistingEmailAsync(string email);
        public Task<bool> IsExistingUserNameAsync(string userName);
        public Task<bool> ChangeUserPasswordByEmailAsync(string email, string newPassword);
        public Task<bool> ResetUserPasswordByUserIdAsync(Guid userId, string currentPassword, string newPassword);
        Task<User> GetUserByEmailAsync(string email);
    }

}
