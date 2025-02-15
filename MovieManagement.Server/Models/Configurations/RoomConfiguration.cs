using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.ToTable("ROOM");
            builder.HasKey(x => x.RoomId);
            builder.Property(x => x.RoomId).UseIdentityColumn(1, 1);
            builder.Property(x => x.RoomId).HasMaxLength(2);
            builder.Property(x => x.Name).HasColumnType("Nvarchar(50)");
        }
    }
}
