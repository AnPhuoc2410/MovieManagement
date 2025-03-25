using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class Room
    {
        public Guid RoomId { get; set; }

        public string RoomName { get; set; }

        public int Row { get; set; }

        public int Column { get; set; }

        public int Total { get; set; }

        public Guid MovieTheaterId { get; set; }

        public virtual MovieTheater MovieTheater { get; set; }

        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

        public virtual ICollection<ShowTime> Showtimes { get; set; } = new List<ShowTime>();    
    }
}