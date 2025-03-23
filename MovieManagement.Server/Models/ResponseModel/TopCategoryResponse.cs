using System.Runtime.CompilerServices;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopCategoryResponse
    {
        public class DateToDate
        {
            public DateTime from { get; set; }
            public DateTime to { get; set; }
        }
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
