using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.DTOs
{
    public class BillDto
    {

        public Guid? BillId { get; set; }

        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public Guid UserId { get; set; }

        public Guid PromotionId { get; set; }

        public BillStatus Status { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé; 3: Đã xem phim


    }
}
