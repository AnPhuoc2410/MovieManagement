using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class MovieCategoryConfiguration : IEntityTypeConfiguration<MovieCategory>
    {
        public void Configure(EntityTypeBuilder<MovieCategory> builder)
        {
            builder.ToTable("MOVIECATEGORY");
            builder.HasKey(x => new { x.CategoryId, x.MovieId });
            builder.HasOne(x => x.Category)
                .WithMany(x => x.MovieCategories)
                .HasForeignKey(x => x.CategoryId);
            builder.HasOne(x => x.Movie)
                .WithMany(x => x.MovieCategories)
                .HasForeignKey(x => x.MovieId);
        }
    }
}
