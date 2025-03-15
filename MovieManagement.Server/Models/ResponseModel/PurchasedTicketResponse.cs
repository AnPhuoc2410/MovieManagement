using System.Data;
using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class PurchasedTicketResponse
    {
        public string MovieName { get; set; }
        public DateTime CreateDate { get; set; }
        public string StartDay{ get; set; }
        public string Showtime { get; set; }
        public string AtRow { get; set; }
        public int AtColumn { get; set; }
        public decimal Price { get; set; }
        public BillStatus Status { get; set; }
    }
}
