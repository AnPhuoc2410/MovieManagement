using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("CHITIETTHELOAI")]
    public class ChiTietTheLoai
    {
        public int MaPhim { get; set; }
        public int MaTheLoai { get; set; }

        [ForeignKey(nameof(MaPhim))]
        public virtual Phim Phim { get; set; }

        [ForeignKey(nameof(MaTheLoai))]
        public virtual TheLoai TheLoai { get; set; }
    }
}