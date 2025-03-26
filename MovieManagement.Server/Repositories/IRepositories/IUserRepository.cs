using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<bool> IsExistingEmailAsync(string email);
        Task<List<User>> GetUserByRoleAsync(Role role);
        public Task<bool> ChangeUserPasswordByEmailAsync(string email, string newPassword);
        public Task<bool> ResetUserPasswordByUserIdAsync(Guid userId, string currentPassword, string newPassword);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByPhoneAsync(string phone);
        Task<User> GetUserByIdCardAsync(string idCard);
        User GetUserByUniqueFields(string email, string idCard, string phoneNumber, string userName);
        bool IsFieldExisting(string fieldName, string fieldValue, Guid? excludeUserId = null);
        
        Task<List<TopMemberResponse.MemberRevenue>> GetTopMemberRevenue();
        Task<List<TopMemberResponse.MemberDaily>> GetTopMemberDailyRevenue(DateTime date);
    }

}
