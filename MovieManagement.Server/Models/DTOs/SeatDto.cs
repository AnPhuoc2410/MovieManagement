﻿using static MovieManagement.Server.Models.Enums.SeatEnum;

namespace MovieManagement.Server.Models.DTOs
{
    public class SeatDto
    {
        public Guid? SeatId { get; set; }

        public string AtRow { get; set; }

        public int AtColumn { get; set; }

        public Guid RoomId { get; set; }

        public Guid SeatTypeId { get; set; }

        public bool IsActive { get; set; }

        public SeatStatus SeatStatus { get; set; }
    }
}
