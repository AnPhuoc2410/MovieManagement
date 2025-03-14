namespace MovieManagement.Server.Models.Entities
{
    public class MovieCategory
    {
        public Guid CategoryId { get; set; }
        public Guid MovieId { get; set; }
        public virtual Category Category { get; set; } 
        public virtual Movie Movie { get; set; } 
    }
}
