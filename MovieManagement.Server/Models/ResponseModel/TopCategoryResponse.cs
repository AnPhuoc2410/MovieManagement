namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopCategoryResponse
    {
        public class CategoryRevenue
        {
            public string CategoryName { get; set; }
            public decimal TicketsSold { get; set; }
        }
        public class Daily
        {
            public DateTime Date { get; set; }
            public List<CategoryRevenue> CategoryRevenues { get; set; }
        }
    }
}
