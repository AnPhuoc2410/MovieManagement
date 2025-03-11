using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models.RequestModel
{
    public class ResetPasswordRequest
    {
        [Required]
        public Guid userId { get; set; }
        [Required]
        public string newPassword { get; set; }
        [Required]
        public string currentPassword { get; set; }
    }
}
