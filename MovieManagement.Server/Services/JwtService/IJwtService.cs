namespace MovieManagement.Server.Services.JwtService
{
    public interface IJwtService
    {

        public string GenerateToken(string email, string role);


    }
}
