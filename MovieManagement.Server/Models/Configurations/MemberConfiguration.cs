using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class MemberConfiguration : IEntityTypeConfiguration<Member>
    {
        public void Configure(EntityTypeBuilder<Member> builder)
        {
            builder.ToTable("MEMBER");
            builder.HasKey(x => x.MemberId);
            //builder.Property(x => x.MemberId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.AccountName).HasColumnType("Varchar(20)");
            builder.Property(x => x.AccountName).HasColumnType("varchar(20)");
            builder.Property(x => x.Avatar).HasColumnType("varchar(50)");
            builder.Property(x => x.FullName).HasColumnType("varchar(30)");
            builder.Property(x => x.IDCard).HasColumnType("varchar(15)");
            builder.Property(x => x.Email).HasColumnType("varchar(50)");
            builder.Property(x => x.PhoneNumber).HasColumnType("varchar(11)");
            builder.Property(x => x.Address).HasColumnType("varchar(50)");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.Member)
                .HasForeignKey(x => x.MemberId);

        }
    }
}
