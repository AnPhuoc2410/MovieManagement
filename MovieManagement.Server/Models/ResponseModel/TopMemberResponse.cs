namespace MovieManagement.Server.Models.ResponseModel
{
    public class TopMemberResponse
    {
        public class MemberRevenue
        {
            public string MemberName { get; set; }
            public decimal PurchasedTicket { get; set; }
            public decimal CurrentPoint { get; set; }
            public decimal TotalPoint { get; set; }
        }
        public class MemberDaily
        {
            public DateTime Day { get; set; }
            public List<MemberRevenue> MemberRevenues { get; set; }
        }
    }
}
