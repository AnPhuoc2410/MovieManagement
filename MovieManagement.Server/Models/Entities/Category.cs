using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class Category
    {
        public int CategoryId { get; set; }

        public string Name { get; set; }

        public IEnumerable<CategoryDetail> CategoryDetails { get; set; } = new List<CategoryDetail>();
    }
}