using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MovieManagement.Server.Models.Entities
{
    [Table("SHOWTIME")]
    public class Showtime
    {
        [Column(Order = 0)]
        public string MovieId { get; set; }

        [Column(Order = 1)]
        public TimeSpan StartTime { get; set; }

        [ForeignKey("MovieId")]
        public virtual Movie Movie { get; set; }

    }
}
