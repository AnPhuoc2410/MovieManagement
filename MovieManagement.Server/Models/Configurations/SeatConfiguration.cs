using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Seat> builder)
        {
            builder.ToTable("SEAT");
            builder.HasKey(x => x.SeatId);
            builder.Property(x => x.SeatId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.AtRow).HasColumnType("varchar(1)");
            builder.Property(x => x.AtRow).IsRequired();
            builder.Property(x => x.AtRow).HasMaxLength(1);
            builder.HasOne(x => x.Room)
                .WithMany(x => x.Seats)
                .HasForeignKey(x => x.RoomId);
            builder.HasOne(x => x.SeatType)
                .WithMany(x => x.Seats)
                .HasForeignKey(x => x.SeatTypeId);
        }
    }
}
