using System.Data;

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
        public int Status { get; set; }
    }
}
