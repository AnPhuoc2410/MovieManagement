using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {

            builder.ToTable("USER");
            builder.HasKey(x => x.UserId);
            builder.Property(x => x.UserId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.UserName).HasColumnType("nVarchar(20)");
            builder.Property(x => x.Avatar).HasColumnType("NVARCHAR(MAX)");   
            builder.Property(x => x.FullName).HasColumnType("nvarchar(30)");
            builder.Property(x => x.IDCard).HasColumnType("nvarchar(15)");
            builder.Property(x => x.Email).HasColumnType("nvarchar(50)");
            builder.Property(x => x.PhoneNumber).HasColumnType("nvarchar(11)");
            builder.Property(x => x.Address).HasColumnType("nvarchar(50)");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);

        }
    }
}
