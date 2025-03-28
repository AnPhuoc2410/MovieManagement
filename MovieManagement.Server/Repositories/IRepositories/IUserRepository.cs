﻿using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<bool> IsExistingEmailAsync(string email);
        Task<bool> IsExistingUserNameAsync(string userName);
        Task<List<User>> GetUserByRoleAsync(Role role);
        public Task<bool> ChangeUserPasswordByEmailAsync(string email, string newPassword);
        public Task<bool> ResetUserPasswordByUserIdAsync(Guid userId, string currentPassword, string newPassword);
        Task<User> GetUserByEmailAsync(string email);
        User GetUserByEmail(string email);
        Task<User> GetByUsername(string username);
        User GetUserByUniqueFields(string email, string idCard, string phoneNumber,
            string userName);
        bool IsExistingEmailOrUsernameOrPhoneOrIdNumber(string email, string username, string phone, string idNumber);
        
    }

}
