using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models.RequestModel
{
    public class SendOtpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
