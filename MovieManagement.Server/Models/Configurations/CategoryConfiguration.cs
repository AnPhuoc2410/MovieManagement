using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("CATEGORY");
            builder.HasKey(x => new { x.MovieId, x.CategoryId });
            builder.HasOne(x => x.Movie)
                .WithMany(x => x.Categories)
                .HasForeignKey(x => x.MovieId);
            builder.HasOne(x => x.CategoryDetail)
                .WithMany(x => x.Categorys)
                .HasForeignKey(x => x.CategoryId);

            
        }
    }
}
