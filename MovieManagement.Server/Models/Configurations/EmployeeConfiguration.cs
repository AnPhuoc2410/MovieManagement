using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {

            builder.ToTable("USER");
            builder.HasKey(x => x.UserId);
            builder.Property(x => x.UserId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.UserName).HasColumnType("Varchar(20)");
            builder.Property(x => x.UserName).HasColumnType("varchar(20)");
            builder.Property(x => x.Avatar).HasColumnType("varchar(50)");
            builder.Property(x => x.FullName).HasColumnType("varchar(30)");
            builder.Property(x => x.IDCard).HasColumnType("varchar(15)");
            builder.Property(x => x.Email).HasColumnType("varchar(50)");
            builder.Property(x => x.PhoneNumber).HasColumnType("varchar(11)");
            builder.Property(x => x.Address).HasColumnType("varchar(50)");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);

        }
    }
}
