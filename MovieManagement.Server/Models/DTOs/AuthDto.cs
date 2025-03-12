namespace MovieManagement.Server.Models.DTOs
{
    public class AuthDto
    {

        public class LoginRequest // For input
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class LoginResponse // For output
        {
            public TokenDto.TokenResponse Token { get; set; }
        }

        public class RegisterRequest
        {
            public string UserName { get; set; }
            public string Password { get; set; }
            public string FullName { get; set; }
            public string Email { get; set; }
            public DateTime BirthDate { get; set; }
            public int Gender { get; set; }
            public string Address { get; set; }

        }

    }
}

