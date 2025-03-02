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
            builder.HasKey(x => x.ShowTimeId);
            builder.HasOne(x => x.Movie)
                .WithMany(x => x.Showtimes)
                .HasForeignKey(x => x.MovieId);
            builder.HasOne(x => x.Room)
                .WithMany(x => x.Showtimes)
                .HasForeignKey(x => x.RoomId);
        }
    }
}
