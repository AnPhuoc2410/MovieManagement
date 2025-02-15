using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class TicketTypeConfiguration : IEntityTypeConfiguration<TicketType>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<TicketType> builder)
        {
            builder.ToTable("TICKETTYPE");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Price).HasColumnType("decimal(18, 0)");
            builder.Property(x => x.Price).IsRequired();
            builder.Property(x => x.Price).HasPrecision(18);
        }
    }
}
