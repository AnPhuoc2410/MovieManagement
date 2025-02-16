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
            builder.Property(x => x.Image).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.Content).HasColumnType("Nvarchar(500)");
            builder.Property(x => x.Content).HasColumnType("ntext");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.Promotion)
                .HasForeignKey(x => x.PromotionId);

        }
    }
}
