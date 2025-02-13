using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MovieManagement.Server.Models.Entities
{
    [Table("XUATCHIEU")]
    public class XuatChieuPhim
    {
        [Key, Column(Order = 0)]
        public int MaPhim { get; set; }

        [Key, Column(Order = 1)]
        public TimeSpan XuatChieu { get; set; }

        [ForeignKey("MaPhim")]
        public virtual Phim Phim { get; set; }
    }
}
