namespace MovieManagement.Server.Models.DTOs
{
    public class TicketTypeDto
    {

        public Guid Id { get; set; }

        public int DayOfWeek { get; set; } 

        public int Hours { get; set; } 

        public int Consumer { get; set; } 

        public int Version { get; set; } 

        public decimal Price { get; set; } 
    }
}
