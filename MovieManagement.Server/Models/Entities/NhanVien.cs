using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("NHANVIEN")]
    public class NhanVien
    {
        [Key]
        public string MaNhanVien { get; set; }  // PK

        public string TenTaiKhoan { get; set; }

        public string MatKhau { get; set; }

        public string AnhDaiDien { get; set; }

        public DateTime NgayThamGia { get; set; }

        public string HoTen { get; set; }

        public DateTime NgaySinh { get; set; }

        public int GioiTinh { get; set; } // 0: Nam, 1: Nữ

        public string CMND { get; set; }

        public string Email { get; set; }


        public string SDT { get; set; }


        public string DiaChi { get; set; }

        public int TrangThai { get; set; } // 0: Khóa, 1: Mở

        public int CapDo { get; set; }

        // Quan hệ 1-N với HoaDonBanVe
        public ICollection<HoaDonBanVe> HoaDonBanVes { get; set; }
    }
}