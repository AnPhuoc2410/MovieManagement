namespace MovieManagement.Server.Models.RequestModel
{
    public class BillRequest
    {
        public int? TotalTicket { get; set; }

        public decimal? Amount { get; set; }

        public List<Guid> Tickets { get; set; } = new List<Guid>();

        public Guid? PromotionId { get; set; }

        public decimal? UsedPoint { get; set; }

        //public Guid? PromotionId { get; set; }
    }
}
