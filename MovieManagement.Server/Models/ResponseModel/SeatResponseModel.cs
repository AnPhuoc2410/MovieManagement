using MovieManagement.Server.Models.Entities;
using Newtonsoft.Json;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class SeatResponseModel
    {

        public Guid SeatId { get; set; }

        public string AtRow { get; set; }

        public int AtColumn { get; set; }

        [JsonIgnore]
        public Guid RoomId { get; set; }

        [JsonIgnore]
        public Guid SeatTypeId { get; set; }

        public bool IsActive { get; set; }

        public SeatStatus Status { get; set; }

        public virtual SeatType SeatType { get; set; }

        //public virtual ICollection<TicketDetail> TicketDetail { get; set; } = new List<TicketDetail>();

    }
}
