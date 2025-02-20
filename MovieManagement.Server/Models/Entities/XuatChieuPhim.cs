using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MovieManagement.Server.Models.Entities
{
    [Table("XUATCHIEU")]
    public class XuatChieuPhim
    {
        [Key]
        public int MaPhim { get; set; }

        public TimeSpan XuatChieu { get; set; }

        [ForeignKey("MaPhim")]
        public virtual Phim Phim { get; set; }
    }
}
