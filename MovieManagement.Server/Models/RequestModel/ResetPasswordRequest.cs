using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models.RequestModel
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string NewPassword { get; set; }
        
        public string? CurrentPassword { get; set; }
    }
}
