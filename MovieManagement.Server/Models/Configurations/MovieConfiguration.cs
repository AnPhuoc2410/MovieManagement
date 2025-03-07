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
            builder.Property(x => x.Name).HasColumnType("nvarchar(100)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(100);
            builder.Property(x => x.Name).IsUnicode(true);
            builder.Property(x => x.Image).HasColumnType("varchar(250)");
            builder.Property(x => x.Image).IsRequired();
            builder.Property(x => x.Image).HasMaxLength(500);
            builder.Property(x => x.Actors).HasColumnType("nvarchar(250)");
            builder.Property(x => x.Director).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Rating).HasColumnType("nvarchar(30)");
            builder.Property(x => x.Trailer).HasColumnType("varchar(100)");
            builder.Property(x => x.Content).HasColumnType("nvarchar(1000)");
            builder.Property(x => x.IsDeleted).HasColumnType("bit");


        }
    }
}
