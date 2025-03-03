namespace MovieManagement.Server.Models.Entities
{
    public class ShowTime
    {
        public Guid? ShowTimeId { get; set; }

        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public DateTime StartTime { get; set; }

        public Movie Movie { get; set; }

        public Room Room { get; set; }

        public List<TicketDetail> TicketDetails { get; set; } = new List<TicketDetail>();

    }
}
