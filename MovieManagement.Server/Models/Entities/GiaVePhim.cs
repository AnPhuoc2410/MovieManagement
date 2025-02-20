using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("GIAVE")]
    public class GiaVePhim
    {
        [Key]
        public int MaGiaVe { get; set; } // Primary Key

        public int LoaiNgay { get; set; } // 0: Thứ 2 4 5; 1: Thứ 3...

        public int MocGio { get; set; } // 0: Trước 17h...

        public int DoiTuong { get; set; } // Loại đối tượng

        public int PhienBan { get; set; } // 0: 2D...

        public decimal GiaVe { get; set; } // Giá vé
    }
}