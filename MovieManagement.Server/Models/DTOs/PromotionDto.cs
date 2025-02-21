namespace MovieManagement.Server.Models.DTOs
{
    public class PromotionDto
    {
        public Guid? PromotionId { get; set; }

        public string PromotionName { get; set; }

        public string Image { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public decimal Discount { get; set; }

        public string Content { get; set; }
    }
}
