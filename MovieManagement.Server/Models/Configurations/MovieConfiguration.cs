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
            //builder.Property(x => x.MovieId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.Name).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(50);
            builder.Property(x => x.Name).IsUnicode(true);
            builder.Property(x => x.Image).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Image).IsRequired();
            builder.Property(x => x.Image).HasMaxLength(50);
            builder.Property(x => x.Actors).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Director).HasColumnType("nvarchar(30)");
            builder.Property(x => x.Rating).HasColumnType("nvarchar(30)");
            builder.Property(x => x.Trailer).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Content).HasColumnType("nvarchar(500)");


        }
    }
}
