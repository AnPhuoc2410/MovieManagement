using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("HOADONBANVE")]
    public class HoaDonBanVe
    {
        [Key]
        [Column(TypeName = "varchar(10)")]
        public string MaHoaDon { get; set; }

        public DateTime NgayLap { get; set; }

        [Column(TypeName = "numeric(10,2)")]
        public decimal DiemDoiVe { get; set; }

        public int SoLuongDoiVe { get; set; }

        [Column(TypeName = "numeric(10,2)")]
        public decimal TongTien { get; set; }

        [Column(TypeName = "varchar(11)")]
        public string MaPhim { get; set; }

        public TimeSpan XuatChieu { get; set; } // Using TimeSpan for time representation

        [Column(TypeName = "varchar(10)")]
        public string MaThanhVien { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string MaNhanVien { get; set; }

        public int MaKhuyenMai { get; set; }

        public int TrangThai { get; set; } // 0: Hủy đặt vé; 1: Chờ nhận vé; 2: Đã nhận vé
    }
}