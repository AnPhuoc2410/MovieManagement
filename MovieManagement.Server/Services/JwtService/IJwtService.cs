using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MovieManagement.Server.Services.JwtService
{
    public interface IJwtService
    {
        string GenerateToken(Guid id, string userName, string role);
        ClaimsPrincipal DecodeToken(string token);
        JwtSecurityToken ReadTokenWithoutValidation(string token);
    }
}
