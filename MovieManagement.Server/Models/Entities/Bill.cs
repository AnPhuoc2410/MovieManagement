using MovieManagement.Server.Models.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.Entities
{

    public class Bill
    {
        public Guid BillId { get; set; } // PK

        public long? PaymentId { get; set; }

        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public Guid? UserId { get; set; }

        public BillStatus Status { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé

        public virtual ICollection<TicketDetail> TicketDetails { get; set; } = new List<TicketDetail>(); // Quan hệ 1-N với TicketDetail

        public virtual User? User { get; set; }
    }
}