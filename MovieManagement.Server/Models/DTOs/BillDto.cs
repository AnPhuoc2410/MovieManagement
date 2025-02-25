namespace MovieManagement.Server.Models.DTOs
{
    public class BillDto
    {
        public Guid? BillId { get; set; }

        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public Guid MovieId { get; set; }

        public TimeSpan Showtime { get; set; } // Using TimeSpan for time representation

        public Guid MemberId { get; set; }

        public Guid EmployeeId { get; set; }

        public Guid PromotionId { get; set; }

        public int Status { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé
    }
}
