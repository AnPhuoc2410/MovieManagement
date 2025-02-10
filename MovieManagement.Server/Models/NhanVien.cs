﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Server.Models
{
    public class NhanVien
    {
        [Key]
        [Column(TypeName = "varchar")]
        [MaxLength(10)]
        public string MaNhanVien { get; set; }

        [Required]
        [Column(TypeName = "varchar")]
        [MaxLength(20)]
        public string TenTaiKhoan { get; set; }

        [Required]
        [Column(TypeName = "varchar")]
        [MaxLength(50)]
        public string MatKhau { get; set; }

        [Column(TypeName = "nvarchar")]
        [MaxLength(50)]
        public string AnhDaiDien { get; set; }

        public DateTime NgayThamGia { get; set; }

        [Required]
        [Column(TypeName = "nvarchar")]
        [MaxLength(30)]
        public string HoTen { get; set; }

        public DateTime NgaySinh { get; set; }

        public int GioiTinh { get; set; }

        [Column(TypeName = "nvarchar")]
        [MaxLength(15)]
        public string CMND { get; set; }

        [Column(TypeName = "nvarchar")]
        [MaxLength(50)]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar")]
        [MaxLength(11)]
        public string SDT { get; set; }

        [Column(TypeName = "nvarchar")]
        [MaxLength(50)]
        public string DiaChi { get; set; }

        public int TrangThai { get; set; }

        public int CapDo { get; set; }
    }
}
