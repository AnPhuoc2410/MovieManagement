using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto> CreateUserAsync(UserDto user);
        Task<UserDto> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserDto>> GetUserPageAsync(int page, int pageSize);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> UpdateUserAsync(Guid id, UserDto user);
        Task<bool> DeleteUserAsync(Guid id);

    }
}
