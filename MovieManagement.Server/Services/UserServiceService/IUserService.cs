using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto.UserResponse> CreateUserAsync(UserDto.CreateUser user);
        Task<UserDto.UserResponse> GetUserByIdAsync(Guid id);
        Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role);
        Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize);
        Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync();
        Task UpdateUserAsync(Guid id, UserDto.UpdateRequest updateRequest);
        Task<bool> DeleteUserAsync(Guid id);
        Task<UserDto.UserResponse> ExtractTokenAsync(string token);

    }
}
