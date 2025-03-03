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
            builder.HasKey(x => x.CategoryId);
            builder.Property(x => x.CategoryId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.Name).HasColumnType("nvarchar(20)");
            builder.Property(x => x.Name).IsRequired();
            builder.Property(x => x.Name).HasMaxLength(20);
            builder.Property(x => x.Name).IsUnicode(true);

        }
    }
}
