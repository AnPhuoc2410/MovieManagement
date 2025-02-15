using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class MovieConfiguration : IEntityTypeConfiguration<Movie>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Movie> builder)
        {

            builder.ToTable("MOVIE");
            builder.HasKey(x => x.MovieId);
            builder.Property(x => x.MovieId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.MovieId).HasColumnType("Nvarchar(11)");
            builder.Property(x => x.Name).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(50);
            builder.Property(x => x.Name).IsUnicode(true);
            builder.Property(x => x.Image).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.Image).IsRequired();
            builder.Property(x => x.Image).HasMaxLength(50);
            builder.Property(x => x.Actors).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.Director).HasColumnType("Nvarchar(30)");
            builder.Property(x => x.Rating).HasColumnType("Nvarchar(30)");
            builder.Property(x => x.Trailer).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.Content).HasColumnType("Nvarchar(500)");
            builder.Property(x => x.EmployeeId).HasColumnType("Nvarchar(10)");
            builder.Property(x => x.RoomId).HasColumnType("Nvarchar(10)");


        }
    }
}
