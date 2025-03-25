using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class MovieTheaterConfiguration : IEntityTypeConfiguration<MovieTheater>
    {
        public void Configure(EntityTypeBuilder<MovieTheater> builder)
        {
            builder.ToTable("MOVIE_THEATER");
            builder.HasKey(x => x.MovieTheaterId);
            builder.Property(x => x.MovieTheaterId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.Name).HasColumnType("nvarchar(100)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(100);
            builder.Property(x => x.Name).IsUnicode(true);
            builder.Property(x => x.Address).HasColumnType("nvarchar(500)");
            builder.Property(x => x.Address).IsRequired();
            builder.Property(x => x.Address).HasMaxLength(500);
            builder.Property(x => x.Address).IsUnicode(true);
            builder.Property(x => x.Image).HasColumnType("varchar(500)");
            builder.Property(x => x.Image).IsRequired();
            builder.Property(x => x.Image).HasMaxLength(500);
            builder.Property(x => x.IsDeleted).HasColumnType("bit");
            builder.HasMany(x => x.Rooms)
                .WithOne(x => x.MovieTheater)
                .HasForeignKey(x => x.MovieTheaterId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
