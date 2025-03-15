using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.RequestModel
{
    public class BillReportRequest
    {
        public Guid BillId { get; set; }
        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public decimal MinusPoint { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public Guid UserId { get; set; }

        public Guid? PromotionId { get; set; }

        public BillStatus Status { get; set; }
    }
}
