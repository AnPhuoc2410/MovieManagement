namespace MovieManagement.Server.Models.Entities
{
    public class ShowTime
    {

        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public TimeSpan StartTime { get; set; }

        public Movie Movie { get; set; }

        public Room Room { get; set; }

    }
}
