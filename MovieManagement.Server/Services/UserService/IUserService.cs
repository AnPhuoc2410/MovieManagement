using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto.UserResponse> CreateUserAsync(UserDto.CreateUser user);
        Task<bool> RegisterWithGoogle(OAuthRequest account);
        Task<UserDto.UserResponse> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize);
        Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role);
        Task UpdateUserAsync(Guid id, UserDto.UpdateRequest updateRequest);
        Task<bool> ChangeUserPasswordByUserId(Guid userId, string currentPassword, string newPassword);
        Task<bool> DeleteUserAsync(Guid id);


    }
}
