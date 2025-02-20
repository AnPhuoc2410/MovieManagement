using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("KHUYENMAI")]
    public class KhuyenMai
    {
        [Key]
        public string MaKhuyenMai { get; set; }

        public string HinhAnh { get; set; }

        public DateTime TuNgay { get; set; }

        public DateTime DenNgay { get; set; }

        public decimal GiamGiaVe { get; set; }

        public string NoiDung { get; set; }
    }
}