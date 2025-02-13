using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("TICKETDETAIL")]
    public class TicketDetail
    {
        [Column(TypeName = "varchar(10)")]
        public string BillId { get; set; }

        public int SeatId { get; set; }

        public int Price { get; set; }

        // Navigation properties
        [ForeignKey("BillId")]
        public virtual Bill Bill { get; set; }
    }
}
