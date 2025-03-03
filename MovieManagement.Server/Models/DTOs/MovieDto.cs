namespace MovieManagement.Server.Models.DTOs
{
    public class MovieDto
    {
        public Guid MovieId { get; set; }

        public string MovieName { get; set; }

        public string Image { get; set; }

        public DateTime PostDate { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string Actors { get; set; }

        public string Director { get; set; }

        public string Rating { get; set; }

        public int Duration { get; set; }

        public int Version { get; set; }

        public string Trailer { get; set; }

        public string Content { get; set; }

        public Guid UserId { get; set; }
    }
}
