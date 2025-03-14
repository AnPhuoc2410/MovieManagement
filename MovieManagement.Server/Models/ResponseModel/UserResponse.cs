using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class UserResponse
    {
        public Guid UserId { get; set; }

        public string UserName { get; set; }

        public string Avatar { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public int Status { get; set; }

        public int Role { get; set; }

        public decimal Point { get; set; }
    }
}
