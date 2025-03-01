using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {

        Task<UserDto> CreateEmployee(UserDto employee);
        Task<UserDto> GetEmployee(Guid id);
        Task<IEnumerable<UserDto>> GetAllEmployees();
        Task<UserDto> UpdateEmployee(Guid id, UserDto employee);
        Task<bool> DeleteEmployee(Guid id);

    }
}
