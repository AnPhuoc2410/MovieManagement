using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto> CreateUser(UserDto user);
        Task<UserDto> GetUser(Guid id);
        Task<IEnumerable<UserDto>> GetAllUsers();
        Task<UserDto> UpdateUser(Guid id, UserDto user);
        Task<bool> DeleteUser(Guid id);

    }
}
