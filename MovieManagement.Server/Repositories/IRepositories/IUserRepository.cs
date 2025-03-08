using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        public Task<bool> IsExistingEmailAsync(string email);
        public Task<bool> IsExistingUserNameAsync(string userName);
        public Task<bool> ChangeUserPasswordByEmailAsync(string email, string newPassword);
        public Task<bool> ResetUserPasswordByUserIdAsync(Guid userId, string currentPassword, string newPassword);
        Task<User> GetUserByEmailAsync(string email);
    }
}
