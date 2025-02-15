using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class CategoryDetailConfiguration : IEntityTypeConfiguration<CategoryDetail>
    {
        public void Configure(EntityTypeBuilder<CategoryDetail> builder)
        {
            builder.ToTable("CATEGORYDETAIL");
            builder.HasKey(x => new { x.MovieId, x.CategoryId });
            builder.HasOne(x => x.Movie)
                .WithMany(x => x.CategoryDetails)
                .HasForeignKey(x => x.MovieId);
            builder.HasOne(x => x.Category)
                .WithMany(x => x.CategoryDetails)
                .HasForeignKey(x => x.CategoryId);
        }
    }
}
