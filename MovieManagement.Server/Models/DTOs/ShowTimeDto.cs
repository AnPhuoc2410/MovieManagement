using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.DTOs
{
    public class ShowTimeDto
    {
        public Guid? ShowTimeId { get; set; }

        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }
    }

    public class ShowTimeInfo
    {
        public Guid? ShowTimeId { get; set; }
        public Guid MovieId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public MovieDto Movie { get; set; }
        public RoomDto Room { get; set; }
    }

}
