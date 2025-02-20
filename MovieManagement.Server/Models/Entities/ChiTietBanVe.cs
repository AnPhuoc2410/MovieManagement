using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("CHITIETBANVE")]
    public class ChiTietBanVe
    {
        public string MaHoaDon { get; set; }

        public int MaGhe { get; set; }

        public int GiaVe { get; set; }

        // Navigation properties
        [ForeignKey("MaHoaDon")]
        public virtual HoaDonBanVe HoaDonBanVe { get; set; }
    }
}
