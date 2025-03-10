using System.Data;
using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.DTOs
{
    public class PurchasedTicketDto
    {
        public string MovieName { get; set; }
        public DateTime CreateDate { get; set; }
        public string StartDay{ get; set; }
        public string Showtime { get; set; }
        public string RoomName { get; set; }
        public decimal Price { get; set; }
        public BillStatus Status { get; set; }
    }
}
