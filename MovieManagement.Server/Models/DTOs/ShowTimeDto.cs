using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.DTOs
{
    public class ShowtimeDto
    {
        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public DateTime StartTime { get; set; }
    }
}
