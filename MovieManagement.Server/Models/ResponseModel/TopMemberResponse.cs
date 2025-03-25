namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopMemberResponse
    {
        public class MemberRevenue
        {
            public string MemberName { get; set; }
            public decimal TicketsSold { get; set; }
            public decimal CurrentPoint { get; set; }
            public decimal TotalPoint { get; set; }
        }
    }
}
