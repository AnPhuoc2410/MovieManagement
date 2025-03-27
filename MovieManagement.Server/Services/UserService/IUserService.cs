using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Services.UserService
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync();
        Task<bool> RegisterWithGoogle(OAuthRequest account);
        Task<UserDto.UserResponse> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize);
        Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role);
        Task<UserDto.UserResponse> FindUserByPhone(string phone);
        Task<UserDto.UserResponse> FindUserByIdCard(string idCard);
        Task UpdateUserAsync(Guid id, UserDto.UpdateRequest updateRequest);
        Task ChangeUserPasswordByUserId(Guid userId, string currentPassword, string newPassword);
        Task<bool> DeleteUserAsync(Guid id);

        Task<bool> ExchangeTickets(Guid userId, BillRequest billRequest);


    }
}
