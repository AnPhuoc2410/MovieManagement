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

        public virtual Room Room { get; set; }

        public virtual SeatType SeatType { get; set; }

        public virtual ICollection<TicketDetail> TicketDetail { get; set; } = new List<TicketDetail>();
    }
}