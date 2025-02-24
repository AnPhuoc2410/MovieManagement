using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.DTOs
{
    public class ShowTimeDto
    {
        public Guid MovieId { get; set; }

        public TimeSpan StartTime { get; set; }

        public Movie Movie { get; set; }
    }
}
