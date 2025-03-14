namespace MovieManagement.Server.Models.Entities
{
    public class ShowTime
    {
        public Guid ShowTimeId { get; set; }

        public Guid MovieId { get; set; }

        public Guid RoomId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public virtual Movie Movie { get; set; }

        public virtual Room Room { get; set; }

        public virtual ICollection<TicketDetail> TicketDetails { get; set; } = new List<TicketDetail>();

    }
}
