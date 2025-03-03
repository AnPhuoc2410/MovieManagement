using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto> CreateAsync(UserDto employee);
        Task<UserDto> GetByIdAsync(Guid id);
        Task<IEnumerable<UserDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> UpdateAsync(Guid id, UserDto employee);
        Task<bool> DeleteAsync(Guid id);

    }
}
