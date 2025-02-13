using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("BILL")]
    public class Bill
    {
        [Key]
        [Column(TypeName = "varchar(10)")]
        public string BillId { get; set; }

        public DateTime CreatedDate { get; set; }

        [Column(TypeName = "numeric(10,2)")]
        public decimal Point { get; set; }

        public int TotalTicket { get; set; }

        [Column(TypeName = "numeric(10,2)")]
        public decimal Amount { get; set; }

        [Column(TypeName = "varchar(11)")]
        public string MovieId { get; set; }

        public TimeSpan Showtime { get; set; } // Using TimeSpan for time representation

        [Column(TypeName = "varchar(10)")]
        public string MemberId { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string EmployeeId { get; set; }

        public int PromotionId { get; set; }

        public int Status { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé
    }
}