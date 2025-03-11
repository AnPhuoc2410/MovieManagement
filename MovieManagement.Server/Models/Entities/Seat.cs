using MovieManagement.Server.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static MovieManagement.Server.Models.Enums.SeatEnum;

namespace MovieManagement.Server.Models.Entities
{

    public enum SeatStatus
    {
        Available = 0,
        Selected = 1,
        Reserved = 2,
        Booked = 3
    }

    public class Seat
    {
        public Guid SeatId { get; set; }

        public string AtRow { get; set; }

        public int AtColumn { get; set; }

        public Guid RoomId { get; set; }

        public Guid SeatTypeId { get; set; }

        public bool IsActive { get; set; }

        public SeatEnum.SeatStatus SeatStatus { get; set; }

        public virtual Room Room { get; set; }

        public virtual SeatType SeatType { get; set; }

        public virtual ICollection<TicketDetail> TicketDetail { get; set; } = new List<TicketDetail>();
    }
}