using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.AuthorizationService
{
    public interface IAuthorizationService
    {

        public Task<RegisterDto> Register(RegisterDto dto);
        public Task<LoginDto> Login(LoginDto dto);
    }
}
