using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class SeatTypeConfiguration : IEntityTypeConfiguration<SeatType>
    {
        public void Configure(EntityTypeBuilder<SeatType> builder)
        {
            builder.ToTable("SEATTYPE");
            builder.HasKey(x => x.SeatTypeId);
            builder.Property(x => x.SeatTypeId).HasDefaultValueSql("NEWID()");
        }
    }
}
