﻿using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Seat> builder)
        {
            builder.ToTable("SEAT");
            builder.HasKey(x => x.SeatId);
            builder.Property(x => x.SeatId).UseIdentityColumn(1, 1);
            builder.Property(x => x.SeatId).HasMaxLength(6);
            builder.Property(x => x.Level).HasColumnType("varchar(1)");
            builder.Property(x => x.Level).IsRequired();
            builder.Property(x => x.Level).HasMaxLength(1);
            builder.HasOne(x => x.Room)
                .WithMany(x => x.Seats)
                .HasForeignKey(x => x.RoomId);
        }
    }
}
