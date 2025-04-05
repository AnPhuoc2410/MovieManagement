namespace MovieManagement.Server.Models.ResponseModel
{
    public class PurchasedTicketResponse
    {
        public string MovieImage { get; set; }
        public string MovieName { get; set; }
        public List<string> MovieCategories { get; set; }
        public string StartDay { get; set; }
        public string StartTime { get; set; }
        public string RoomName { get; set; }
        public string AtRow { get; set; }
        public int AtColumn { get; set; }
        public string SeatType { get; set; }
    }
}
