namespace MovieManagement.Server.Services.JwtService
{
    public interface IJwtService
    {

        public string GenerateToken(Guid id, string userName, string role);


    }
}
