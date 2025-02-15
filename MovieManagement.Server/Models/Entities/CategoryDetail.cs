using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    //[Table("CATEGORYDETAIL")]
    public class CategoryDetail
    {
        public Guid MovieId { get; set; }

        public Guid CategoryId { get; set; }

        //[ForeignKey(nameof(MovieId))]
        public Movie Movie { get; set; }

        //[ForeignKey(nameof(CategoryId))]
        public Category Category { get; set; }

        //public IEnumerable<Movie> Movies { get; set; }

        //public IEnumerable<Category> Categories { get; set; }

    }
}