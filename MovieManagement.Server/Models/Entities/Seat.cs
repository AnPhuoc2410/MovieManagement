using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("SEAT")]
    public class Seat
    {
        [Key]
        public int SeatId { get; set; }

        [Column(TypeName = "varchar(1)")]
        public string Level { get; set; }

        public int Number { get; set; }

        public int Type { get; set; }

        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; }
    }
}