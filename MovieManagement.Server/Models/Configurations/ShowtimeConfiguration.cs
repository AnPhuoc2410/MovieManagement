using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class ShowtimeConfiguration : IEntityTypeConfiguration<ShowTime>
    {
        public void Configure(EntityTypeBuilder<ShowTime> builder)
        {
            builder.ToTable("SHOWTIME");
            builder.HasKey(ct => new { ct.MovieId, ct.RoomId });
            builder.Property(x => x.MovieId).HasColumnOrder(0);
            builder.Property(x => x.RoomId).HasColumnOrder(1);
            //builder.Property(x => x.ShowtimeId).HasColumnType("varchar(10)");
            //builder.Property(x => x.ShowtimeId).IsRequired();
            //builder.Property(x => x.ShowtimeId).HasMaxLength(10);
            //builder.Property(x => x.MovieId).HasColumnType("Nvarchar(11)");
            //builder.Property(x => x.RoomId).HasColumnType("varchar(10)");
            //builder.Property(x => x.Price).HasColumnType("decimal(18, 0)");
            builder.HasOne(x => x.Movie)
                .WithMany(x => x.Showtimes)
                .HasForeignKey(x => x.MovieId);
            builder.HasOne(x => x.Room)
                .WithMany(x => x.Showtimes)
                .HasForeignKey(x => x.RoomId);
        }
    }
}
