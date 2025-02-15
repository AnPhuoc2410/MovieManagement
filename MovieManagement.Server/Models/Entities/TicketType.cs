using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class TicketType
    {
        public int Id { get; set; } // Primary Key

        public int DayOfWeek { get; set; } // 0: Thứ 2 4 5; 1: Thứ 3...

        public int Hours { get; set; } // 0: Trước 17h...

        public int Consumer { get; set; } // Loại đối tượng

        public int Version { get; set; } // 0: 2D...

        public decimal Price { get; set; } // Giá vé
    }
}