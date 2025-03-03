using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Models.DTOs
{
    public class TicketDetailDto
    {
        public Guid BillId { get; set; }
        public Guid SeatId { get; set; }
        public Guid TicketTypeId { get; set; }
    }
}
