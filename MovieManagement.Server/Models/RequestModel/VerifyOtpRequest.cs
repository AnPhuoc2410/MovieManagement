
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models.RequestModel
{
    public class VerifyOtpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Code { get; set; }
    }
}
