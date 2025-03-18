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
            builder.Property(x => x.RoomId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.RoomId).HasMaxLength(2);
            builder.Property(x => x.RoomName).HasColumnType("varchar(50)");


        }
    }
}
