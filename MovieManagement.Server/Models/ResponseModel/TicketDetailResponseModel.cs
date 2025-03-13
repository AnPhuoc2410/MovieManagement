using MovieManagement.Server.Models.Entities;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class TicketDetailResponseModel
    {
        public Guid TicketId { get; set; }

        public Guid SeatId { get; set; }

        public byte[] Version { get; set; }

        public TicketStatus Status { get; set; }

        // Navigation properties

        public virtual SeatResponseModel Seat { get; set; }
    }
}
