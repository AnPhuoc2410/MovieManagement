namespace MovieManagement.Server.Models.Entities
{
    public class MovieTheater
    {

        public Guid MovieTheaterId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Image { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();



    }
}
