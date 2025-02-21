using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.DTOs
{
    public class ShowtimeDto
    {
        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public TimeSpan StartTime { get; set; }
    }
}
