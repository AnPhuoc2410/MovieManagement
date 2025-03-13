using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class BillConfiguration : IEntityTypeConfiguration<Bill>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Bill> builder)
        {

            builder.ToTable("BILL");
            builder.HasKey(x => x.BillId);
            builder.Property(x => x.BillId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.CreatedDate).IsRequired();
            builder.Property(x => x.Point).HasColumnType("numeric(10,2)");
            builder.Property(x => x.MinusPoint).HasColumnType("numeric(10,2)");
            builder.Property(x => x.TotalTicket).IsRequired();
            builder.Property(x => x.Amount).HasColumnType("numeric(10,2)");
            builder.Property(x => x.Status).IsRequired();
            builder.HasMany(x => x.TicketDetails)
                .WithOne(x => x.Bill)
                .HasForeignKey(x => x.BillId);
            builder.HasOne(x => x.Promotion)
                .WithMany(x => x.Bills)
                .HasForeignKey(x => x.PromotionId);

        }
    }
}
