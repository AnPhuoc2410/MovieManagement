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
            builder.Property(x => x.Description).HasColumnType("nvarchar(500)"); 
            //builder.HasOne(x => x.Movie)
            //    .WithMany(x => x.Categories)
            //    .HasForeignKey(x => x.MovieId);


        }
    }
}
