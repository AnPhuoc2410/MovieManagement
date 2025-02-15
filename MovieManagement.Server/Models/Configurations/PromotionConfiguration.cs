using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Promotion> builder)
        {
            builder.ToTable("PROMOTION");
            builder.HasKey(x => x.PromotionId);
            builder.Property(x => x.PromotionId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.PromotionId).HasColumnType("varchar(10)");
            builder.Property(x => x.PromotionId).IsRequired();
            builder.Property(x => x.PromotionId).HasMaxLength(10);
            builder.Property(x => x.Image).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.Content).HasColumnType("Nvarchar(500)");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.Promotion)
                .HasForeignKey(x => x.PromotionId);

        }
    }
}
