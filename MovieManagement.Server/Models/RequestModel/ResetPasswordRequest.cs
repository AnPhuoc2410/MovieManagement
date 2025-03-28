﻿using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models.RequestModel
{
    public class ResetPasswordRequest
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        public string CurrentPassword { get; set; }
    }
}
