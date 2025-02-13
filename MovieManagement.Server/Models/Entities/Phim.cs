using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("PHIM")]
    public class Phim
    {
        [Key]
        public int MaPhim { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string TenPhim { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string HinhAnh { get; set; }

        public DateTime NgayDang { get; set; }

        public DateTime TuNgay { get; set; }

        public DateTime DenNgay { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string DienVien { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string DaoDien { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Hang { get; set; }

        public int ThoiLuong { get; set; }

        public int PhienBan { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Trailer { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string NoiDung { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string MaNhanVien { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string MaPhong { get; set; }
    }
}