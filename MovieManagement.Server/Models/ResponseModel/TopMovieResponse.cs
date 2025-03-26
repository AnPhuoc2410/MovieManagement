namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopMovieResponse
    {
        public class MovieRevenue
        {
            public string MovieName { get; set; }
            public decimal Revenue { get; set; }
        }

        public class MovieDaily
        {
            public DateTime Day { get; set; }
            public List<MovieRevenue> MovieRevenues { get; set; }
        }
    }
}
