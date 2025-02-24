using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Models.DTOs
{
    public class TicketDetailDto
    {
        public Guid BillId { get; set; }
        public Guid seatId { get; set; }
        public int Price { get; set; }
    }
}
