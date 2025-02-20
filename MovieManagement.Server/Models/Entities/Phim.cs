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


        public string TenPhim { get; set; }


        public string HinhAnh { get; set; }

        public DateTime NgayDang { get; set; }

        public DateTime TuNgay { get; set; }

        public DateTime DenNgay { get; set; }


        public string DienVien { get; set; }


        public string DaoDien { get; set; }


        public string Hang { get; set; }

        public int ThoiLuong { get; set; }

        public int PhienBan { get; set; }


        public string Trailer { get; set; }

        public string NoiDung { get; set; }

        public string MaNhanVien { get; set; }

        public string MaPhong { get; set; }
    }
}