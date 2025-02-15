using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MovieManagement.Server.Models.Entities
{

    public class Showtime
    {

        public Guid MovieId { get; set; }

        public TimeSpan StartTime { get; set; }

        public Movie Movie { get; set; }

    }
}
