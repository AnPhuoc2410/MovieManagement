namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopShowtimeResponse
    {
        public class ShowtimeRevenue
        {
            public Dictionary<String, decimal> TopRevenue { get; set; }

            public ShowtimeRevenue()
            {
                TopRevenue = new Dictionary<String, decimal>();
            }
        }

        public class Daily
        {
            public DateTime Day { get; set; }
            public List<ShowtimeRevenue> showtimeRevenues { get; set; }
        }
    }
}
