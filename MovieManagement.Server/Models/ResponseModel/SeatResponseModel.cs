using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
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

        public SeatEnum.SeatStatus Status { get; set; }

        public virtual SeatType SeatType { get; set; }
        [JsonIgnore]
        public virtual Room Room { get; set; }

        // New property to get the RoomName
        public string RoomName => Room?.RoomName;
        //public virtual ICollection<TicketDetail> TicketDetail { get; set; } = new List<TicketDetail>();

    }
}
