using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class TicketDetailConfiguration : IEntityTypeConfiguration<TicketDetail>
    {
        public void Configure(EntityTypeBuilder<TicketDetail> builder)
        {
            builder.ToTable("TICKETDETAIL");
            builder.HasKey(x => new { x.BillId, x.SeatId, x.ShowTimeId });
            //builder.Property(x => x.SeatId).IsRequired();
            //builder.Property(x => x.Price).IsRequired();
            builder.HasOne(x => x.Bill)
                .WithMany(x => x.TicketDetails)
                .HasForeignKey(x => x.BillId);
            builder.HasOne(x => x.Seat)
                .WithMany(x => x.TicketDetail)
                .HasForeignKey(x => x.SeatId);
            builder.HasOne(x => x.ShowTime)
                .WithMany(x => x.TicketDetails)
                .HasForeignKey(x => x.ShowTimeId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
