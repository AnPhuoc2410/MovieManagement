using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.AuthorizationService
{
    public interface IAuthenticateService
    {
        Task<AuthDto.LoginResponse> Login(AuthDto.LoginRequest dto);
        Task<UserDto.UserResponse> Register(AuthDto.RegisterRequest dto);
        Task<UserDto.UserResponse> ExtractTokenAsync(string token);
    }
}
