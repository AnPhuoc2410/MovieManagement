using System.ComponentModel.DataAnnotations.Schema;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Models.Entities
{

    public class TicketDetail
    {
        public Guid TicketId { get; set; }

        public Guid? BillId { get; set; }

        public Guid SeatId { get; set; }

        public Guid ShowTimeId { get; set; }

        public byte[] Version { get; set; }

        public TicketStatus Status { get; set; }

        // Navigation properties

        public virtual Bill? Bill { get; set; }

        public virtual Seat Seat { get; set; }

        public virtual ShowTime ShowTime { get; set; }
    }
}
