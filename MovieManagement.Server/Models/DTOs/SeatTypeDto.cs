namespace MovieManagement.Server.Models.DTOs
{
    public class SeatTypeDto
    {

        public Guid? SeatTypeId { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public bool IsActive { get; set; }


    }
}
