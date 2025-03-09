using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.AuthorizationService
{
    public interface IAuthenticateService
    {

      Task<UserDto> Register(RegisterDto dto);
       Task<LoginResponseDto> Login(LoginRequestDto dto);
 }
}
