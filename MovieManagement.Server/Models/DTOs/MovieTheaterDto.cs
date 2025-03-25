namespace MovieManagement.Server.Models.DTOs
{
    public class MovieTheaterDto
    {

        public Guid? MovieTheaterId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public string Image { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }


    }
}
