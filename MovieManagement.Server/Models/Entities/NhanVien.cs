﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("NHANVIEN")]
    public class NhanVien
    {
        [Key]
        [Column(TypeName = "varchar(10)")]
        public string MaNhanVien { get; set; }  // PK

        [Column(TypeName = "varchar(20)")]
        public string TenTaiKhoan { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string MatKhau { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string AnhDaiDien { get; set; }

        public DateTime NgayThamGia { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string HoTen { get; set; }

        public DateTime NgaySinh { get; set; }

        public int GioiTinh { get; set; } // 0: Nam, 1: Nữ

        [Column(TypeName = "nvarchar(15)")]
        public string CMND { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar(11)")]
        public string SDT { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string DiaChi { get; set; }

        public int TrangThai { get; set; } // 0: Khóa, 1: Mở

        public int CapDo { get; set; }

        // Quan hệ 1-N với HoaDonBanVe
        public ICollection<HoaDonBanVe> HoaDonBanVes { get; set; }
    }
}