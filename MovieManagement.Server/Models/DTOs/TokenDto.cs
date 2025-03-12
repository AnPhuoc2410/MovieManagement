namespace MovieManagement.Server.Models.DTOs;

public class TokenDto
{
    public class TokenRequest
    {
        public string AccessToken { get; set; }
    }

    public class TokenResponse
    {
        public string AccessToken { get; set; }
        public DateTime Expires { get; set; }
    }
    
}