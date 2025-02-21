using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class Room
    {
        public Guid RoomId { get; set; }

        public string Name { get; set; }

        public int Row { get; set; }

        public int Column { get; set; }

        public int Total { get; set; }

        public IEnumerable<Seat> Seats { get; set; } = new List<Seat>();

        public IEnumerable<ShowTime> Showtimes { get; set; } = new List<ShowTime>();    
    }
}