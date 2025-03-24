namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopShowtimeResponse
    {
        public class ShowtimeRevenue
        {
            public int TimeInDay { get; set; }
            public decimal TicketsSold { get; set; }
        }

        public class Daily
        {
            public DateTime Day { get; set; }
            public List<ShowtimeRevenue> showtimeRevenues { get; set; }
        }
    }
}
