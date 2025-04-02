using System.ComponentModel.DataAnnotations;
using MovieManagement.Server.Models.Enums;

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
            public string? Avatar { get; set; }
            
            [Required(ErrorMessage = "Username is required")]
            [StringLength(50, ErrorMessage = "Username cannot be longer than 50 characters")]
            public string UserName { get; set; }

            [Required(ErrorMessage = "Password is required")]
            [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
            public string Password { get; set; }

            [Required(ErrorMessage = "Full name is required")]
            [StringLength(100, ErrorMessage = "Full name cannot be longer than 100 characters")]
            public string FullName { get; set; }

            [Required(ErrorMessage = "Birthdate is required")]
            [DataType(DataType.Date, ErrorMessage = "Invalid date format")]
            public DateTime BirthDate { get; set; }

            [Required(ErrorMessage = "Gender is required")]
            public UserEnum.UserGender Gender { get; set; }

            [Required(ErrorMessage = "ID Card is required")]
            [StringLength(20, ErrorMessage = "ID Card cannot be longer than 20 characters")]
            public string IDCard { get; set; }

            [Required(ErrorMessage = "Email is required")]
            [EmailAddress(ErrorMessage = "Invalid email address")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Address is required")]
            [StringLength(200, ErrorMessage = "Address cannot be longer than 200 characters")]
            public string Address { get; set; }

            [Required(ErrorMessage = "Phone number is required")]
            [Phone(ErrorMessage = "Invalid phone number")]
            [StringLength(15, ErrorMessage = "Phone number cannot be longer than 15 characters")]
            public string PhoneNumber { get; set; }
        }
        
        public class FindExistingUser
        {
            public string Email { get; set; }
        }

    }
}

