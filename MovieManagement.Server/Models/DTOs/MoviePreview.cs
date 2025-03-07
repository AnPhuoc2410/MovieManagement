namespace MovieManagement.Server.Models.DTOs
{
    public class MoviePreview
    {
        public Guid MovieId { get; set; }

        public string Name { get; set; }

        public string Image { get; set; }

        public string Trailer { get; set; }
    }
}
