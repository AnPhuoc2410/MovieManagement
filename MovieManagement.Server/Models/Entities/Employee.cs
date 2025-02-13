using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("EMPLOYEE")]
    public class Employee
    {
        [Key]
        [Column(TypeName = "varchar(10)")]
        public string EmployeeId { get; set; }  // PK

        [Column(TypeName = "varchar(20)")]
        public string AccountName { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string Password { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Avatar { get; set; }

        public DateTime JoinDate { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string FullName { get; set; }

        public DateTime BirthDate { get; set; }

        public int Gender { get; set; } // 0: Nam, 1: Nữ

        [Column(TypeName = "nvarchar(15)")]
        public string IDCard { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar(11)")]
        public string PhoneNumber { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Address { get; set; }

        public int Status { get; set; } // 0: Khóa, 1: Mở

        public int Level { get; set; }

        // Quan hệ 1-N với HoaDonBanVe
        public ICollection<Bill> Bills { get; set; }
    }
}