using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    public class Movie
    {
        public Guid MovieId { get; set; }

        public string Name { get; set; }

        public string Image { get; set; }

        public DateTime PostDate { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string Actors { get; set; }

        public string Director { get; set; }

        public string Rating { get; set; }

        public int Duration { get; set; }

        public int Version { get; set; }

        public string Trailer { get; set; }

        public string Content { get; set; }

        public Guid EmployeeId { get; set; }

        //public Guid RoomId { get; set; }

        public IEnumerable<CategoryDetail> CategoryDetails { get; set; } = new List<CategoryDetail>();

        public IEnumerable<Showtime> Showtimes { get; set; } = new List<Showtime>();

        public IEnumerable<Bill> Bills { get; set; } = new List<Bill>();
    }
}