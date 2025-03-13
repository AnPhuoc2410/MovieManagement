using static MovieManagement.Server.Models.Enums.BillEnum;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class BillResponse
    {
        public DateTime CreatedDate { get; set; }

        public decimal Point { get; set; }

        public decimal MinusPoint { get; set; }

        public int TotalTicket { get; set; }

        public decimal Amount { get; set; }

        public BillStatus Status { get; set; }
    }
}
