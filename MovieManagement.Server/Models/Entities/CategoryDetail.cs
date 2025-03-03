using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class CategoryDetail
    {
        public Guid CategoryId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<Category> Categories { get; set; } = new List<Category>();

    }
}