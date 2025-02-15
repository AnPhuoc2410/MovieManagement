﻿using System.ComponentModel.DataAnnotations.Schema;

namespace MovieManagement.Server.Models.Entities
{

    public class TicketDetail
    {

        public Guid BillId { get; set; }

        public Guid SeatId { get; set; }

        public int Price { get; set; }

        // Navigation properties

        public virtual Bill Bill { get; set; }

        public virtual Seat Seat { get; set; }
    }
}
