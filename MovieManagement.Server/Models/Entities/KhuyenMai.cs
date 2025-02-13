using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("KHUYENMAI")]
    public class KhuyenMai
    {
        [Key]
        [Column(TypeName = "varchar(10)")]
        public string MaKhuyenMai { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string HinhAnh { get; set; }

        public DateTime TuNgay { get; set; }

        public DateTime DenNgay { get; set; }

        public decimal GiamGiaVe { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string NoiDung { get; set; }
    }
}