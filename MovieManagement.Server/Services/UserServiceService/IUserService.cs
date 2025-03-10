using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto> CreateUserAsync(UserDto user);
        Task<bool> CreateUserByOAuthAsync(OAuthRequest account);
        Task<UserDto> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserDto>> GetUserPageAsync(int page, int pageSize);
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();
        Task<UserResponse> UpdateUserAsync(Guid id, UserDto user);
        Task<bool> ChangeUserPasswordByUserId(Guid userId, string currentPassword, string newPassword);
        Task<bool> DeleteUserAsync(Guid id);

    }
}
