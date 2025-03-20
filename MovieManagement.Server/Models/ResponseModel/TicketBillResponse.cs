using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class TicketBillResponse
    {
        public string MovieName { get; set; }
        public string StartDay { get; set; }
        public string StartTime { get; set; }
        public string SeatType { get; set; }
        public string AtRow { get; set; }
        public int AtColumn { get; set; }
        public decimal Price { get; set; }
        public BillStatus Status { get; set; }
    }
}
