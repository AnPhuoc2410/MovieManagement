using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class Category
    {

        public Guid MovieId { get; set; }

        public Guid CategoryId { get; set; }

        public Movie Movie { get; set; }

        public CategoryDetail CategoryDetail { get; set; }

    }
}