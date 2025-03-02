using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class Seat
    {
        public Guid SeatId { get; set; }

        public string AtRow { get; set; }

        public int AtColumn { get; set; }

        public Guid RoomId { get; set; }

        public Guid SeatTypeId { get; set; }

        public bool IsActive { get; set; }

        public Room Room { get; set; }

        public SeatType SeatType { get; set; }

        public List<TicketDetail> TicketDetail { get; set; } = new List<TicketDetail>();
    }
}