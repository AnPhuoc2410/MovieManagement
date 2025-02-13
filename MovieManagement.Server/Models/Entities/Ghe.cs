using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("GHE")]
    public class Ghe
    {
        [Key]
        public int MaGhe { get; set; }

        [Column(TypeName = "varchar(1)")]
        public string Hang { get; set; }

        public int SoGhe { get; set; }

        public int LoaiGhe { get; set; }

        public int MaPhong { get; set; }

        [ForeignKey("MaPhong")]
        public PhongChieu PhongChieu { get; set; }
    }
}