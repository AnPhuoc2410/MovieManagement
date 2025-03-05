using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class Category
    {
        public Guid CategoryId { get; set; }

        public Guid MovieId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public virtual Movie Movie { get; set; }


    }
}