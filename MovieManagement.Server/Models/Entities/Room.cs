using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("ROOM")]
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string Name { get; set; }

        public int Row { get; set; }

        public int Column { get; set; }

        public int Total { get; set; }
    }
}