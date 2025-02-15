using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class Bill
    {

        public string BillId { get; set; }

        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public string MovieId { get; set; }

        public TimeSpan Showtime { get; set; } // Using TimeSpan for time representation

        public string MemberId { get; set; }

        public string EmployeeId { get; set; }

        public int PromotionId { get; set; }

        public int Status { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé

        public IEnumerable<TicketDetail> TicketDetails { get; set; } = new List<TicketDetail>();

    }
}