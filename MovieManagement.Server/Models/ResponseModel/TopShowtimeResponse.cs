namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopShowtimeResponse
    {
        public class ShowtimeRevenue
        {
            public DateTime TimeInDay { get; set; }
            public decimal Amount { get; set; }
        }

        public class Daily
        {
            public DateTime Day { get; set; }
            public List<ShowtimeRevenue> showtimeRevenues { get; set; }
        }
    }
}
