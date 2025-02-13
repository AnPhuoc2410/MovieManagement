using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{
    [Table("PROMOTION")]
    public class Promotion
    {
        [Key]
        [Column(TypeName = "varchar(10)")]
        public string PromotionId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Image { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public decimal Discount { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Content { get; set; }
    }
}