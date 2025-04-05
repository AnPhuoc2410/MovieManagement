using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.JwtService
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        ClaimsPrincipal DecodeToken(string token);
        JwtSecurityToken ReadTokenWithoutValidation(string token);
    }
}
