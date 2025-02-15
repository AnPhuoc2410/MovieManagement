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
            builder.Property(x => x.RoomId).HasColumnType("varchar(10)");
            builder.Property(x => x.RoomId).IsRequired();
            builder.Property(x => x.RoomId).HasMaxLength(10);
            builder.Property(x => x.Name).HasColumnType("Nvarchar(50)");
        }
    }
}
