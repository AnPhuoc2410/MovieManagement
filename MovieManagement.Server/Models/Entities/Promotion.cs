using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class Promotion
    {

        public Guid PromotionId { get; set; }
        public string PromotionName { get; set; }
        public string Image { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public decimal Discount { get; set; }

        public string Content { get; set; }

        public IEnumerable<Bill> Bills { get; set; } = new List<Bill>();

    }
}