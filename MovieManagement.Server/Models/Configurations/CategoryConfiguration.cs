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
            builder.HasKey(x => x.CategoryId);
            builder.Property(x => x.CategoryId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.Name).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(50);
            builder.Property(x => x.Name).IsUnicode(true);
            //builder.HasOne(x => x.Movie)
            //    .WithMany(x => x.Categories)
            //    .HasForeignKey(x => x.MovieId);

            // Seed data
            builder.HasData(
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Hoạt hình"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Viễn tưởng"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Kinh dị"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Hài hước"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Tình cảm"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Thần thoại"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Hành động"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Phiêu Lưu"
                },
                new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = "Gia đình"
                }
            );
        }
    }
}
