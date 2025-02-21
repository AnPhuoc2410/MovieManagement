namespace MovieManagement.Server.Models.Entities
{
    public class Showtime
    {

        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public TimeSpan StartTime { get; set; }

        public Movie Movie { get; set; }

        public Room Room { get; set; }

    }
}
