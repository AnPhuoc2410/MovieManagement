using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class Seat
    {
        public Guid SeatId { get; set; }

        public string Level { get; set; }

        public int Number { get; set; }

        public int Type { get; set; }

        public Guid RoomId { get; set; }

        public Room Room { get; set; }

        public List<TicketDetail> TicketDetail { get; set; } = new List<TicketDetail>();
    }
}