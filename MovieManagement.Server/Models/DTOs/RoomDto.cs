namespace MovieManagement.Server.Models.DTOs
{
    public class RoomDto
    {
        public Guid? RoomId { get; set; }

        public string RoomName { get; set; }

        public int Row { get; set; }

        public int Column { get; set; }

        public int Total { get; set; }

        public Guid MovieTheaterId { get; set; }

        public virtual MovieTheaterDto MovieTheater { get; set; }
    }
}
