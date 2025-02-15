using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    //[Table("CATEGORYDETAIL")]
    public class CategoryDetail
    {
        public int MovieId { get; set; }
        public int CategoryId { get; set; }

        //[ForeignKey(nameof(MovieId))]
        public virtual Movie Movie { get; set; }

        //[ForeignKey(nameof(CategoryId))]
        public virtual Category Category { get; set; }

        //public IEnumerable<Movie> Movies { get; set; }

        //public IEnumerable<Category> Categories { get; set; }

    }
}