namespace MovieManagement.Server.Models.DTOs
{
    public class SeatDto
    {
        public string Level { get; set; }

        public int Number { get; set; }

        public int Type { get; set; }

        public Guid RoomId { get; set; }
    }
}
