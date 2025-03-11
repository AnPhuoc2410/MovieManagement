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
        Task<User> GetByUsername(string username);
    }

}
