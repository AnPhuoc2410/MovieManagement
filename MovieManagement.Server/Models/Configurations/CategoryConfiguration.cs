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
            builder.Property(x => x.Name).HasColumnType("Nvarchar(20)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(20);
            builder.Property(x => x.Name).IsUnicode(true);
        }
    }
}
