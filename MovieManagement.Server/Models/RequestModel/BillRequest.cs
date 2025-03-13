namespace MovieManagement.Server.Models.RequestModel
{
    public class BillRequest
    {
        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public Guid? PromotionId { get; set; }
    }
}
