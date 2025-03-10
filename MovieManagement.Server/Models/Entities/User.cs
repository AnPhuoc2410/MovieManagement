using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Models.Entities
{

    public class User
    {

        public Guid UserId { get; set; }  // PK

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Avatar { get; set; }

        public DateTime JoinDate { get; set; }

        public string FullName { get; set; }

        public DateTime BirthDate { get; set; }

        public UserGender Gender { get; set; } // 0: Nam, 1: Nữ

        public string IDCard { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public UserStatus Status { get; set; } // 0: Khóa, 1: Mở

        public Role Role { get; set; }

        public decimal Point { get; set; }

        // Quan hệ 1-N với HoaDonBanVe
        public virtual ICollection<Bill> Bills { get; set; } = new List<Bill>();
    }
}