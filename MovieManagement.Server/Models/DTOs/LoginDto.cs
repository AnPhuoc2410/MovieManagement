namespace MovieManagement.Server.Models.DTOs
{
public class LoginRequestDto // For input
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class LoginResponseDto // For output
{
    public string Token { get; set; }
}
}
