using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class Bill
    {
        public Guid BillId { get; set; }

        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public Guid UserId { get; set; }

        public Guid PromotionId { get; set; }

        public int Status { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé

        public IEnumerable<TicketDetail> TicketDetails { get; set; } = new List<TicketDetail>(); // Quan hệ 1-N với TicketDetail

        public User User { get; set; }

        public Promotion Promotion { get; set; }
    }
}