namespace MovieManagement.Server.Models.ResponseModel
{
    public class RevenueResponse
    {
        public class DailyStatistics
        {
            public DateTime DayTime { get; set; }
            public int TotalTickets { get; set; }
            public decimal TotalAmount { get; set; }
        }
    }
}
