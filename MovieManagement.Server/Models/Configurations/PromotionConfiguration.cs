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
            builder.Property(x => x.Image).HasColumnType("text");
            builder.Property(x => x.Content).HasColumnType("nvarchar(500)");
            //builder.HasMany(x => x.Bills)
            //    .WithOne(x => x.Promotion)
            //    .HasForeignKey(x => x.PromotionId);

        }
    }
}
