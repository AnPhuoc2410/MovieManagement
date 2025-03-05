namespace MovieManagement.Server.Models.DTOs
{
    public class CategoryDto
    {

        public Guid? CategoryId { get; set; }

        public Guid? MovieId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

    }
}
