using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.ResponseModel
{
    public class RoomResponseModel
    {

        public Guid? RoomId { get; set; }

        public string Name { get; set; }

        public int Row { get; set; }

        public int Column { get; set; }

        public int Total { get; set; }

        public IEnumerable<SeatResponseModel> Seats { get; set; } = new List<SeatResponseModel>();

        //public IEnumerable<ShowTime> Showtimes { get; set; } = new List<ShowTime>();


    }
}
