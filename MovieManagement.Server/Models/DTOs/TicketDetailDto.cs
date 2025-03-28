using MovieManagement.Server.Models.DTOs;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Models.DTOs
{
    public class TicketDetailDto
    {

        public Guid TicketId { get; set; }

        public Guid? BillId { get; set; }

        public Guid SeatId { get; set; }

        public Guid ShowTimeId { get; set; }

        public TicketStatus Status { get; set; }

        public byte[]? Version { get; set; }


    }
}
