using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("MOVIE")]
    public class Movie
    {
        [Key]
        public int MovieId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Image { get; set; }

        public DateTime PostDate { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Actors { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Director { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Rating { get; set; }

        public int Duration { get; set; }

        public int Version { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Trailer { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Content { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string EmployeeId { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string RoomId { get; set; }
    }
}