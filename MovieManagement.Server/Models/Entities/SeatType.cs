using Newtonsoft.Json;

namespace MovieManagement.Server.Models.Entities
{
    public class SeatType
    {

        public Guid SeatTypeId { get; set; }

        public string TypeName { get; set; }

        public decimal Price { get; set; }

        public bool IsActive { get; set; }

        [JsonIgnore]
        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    }
}
