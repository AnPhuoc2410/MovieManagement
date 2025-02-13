﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("THELOAI")]
    public class TheLoai
    {
        [Key]
        public int MaTheLoai { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string TenTheLoai { get; set; }
    }
}