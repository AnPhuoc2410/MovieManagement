namespace MovieManagement.Server.Models.Entities
{
    public class SeatType
    {

        public Guid SeatTypeId { get; set; }

        public string TypeName { get; set; }

        public decimal Price { get; set; }

        public IEnumerable<Seat> Seats { get; set; } = new List<Seat>();

        public bool IsActive { get; set; }

    }
}
