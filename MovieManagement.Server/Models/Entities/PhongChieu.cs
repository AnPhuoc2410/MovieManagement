using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("PHONGCHIEU")]
    public class PhongChieu
    {
        [Key]
        public int MaPhong { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string TenPhong { get; set; }

        public int HangGhe { get; set; }

        public int CotGhe { get; set; }

        public int TongSoGhe { get; set; }
    }
}