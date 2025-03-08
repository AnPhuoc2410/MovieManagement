using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class OtpCodeConfiguration : IEntityTypeConfiguration<OtpCode>
    {
        public void Configure(EntityTypeBuilder<OtpCode> builder)
        {
            builder.ToTable("OTP_CODE");
            builder.HasKey(x => x.otpId);
            builder.Property(x => x.otpId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.Email).HasColumnType("varchar(200)");
            builder.Property(x => x.Email).HasMaxLength(200);
            builder.Property(x => x.Email).IsRequired();
            builder.Property(x => x.Code).HasColumnType("varchar(7)");
            builder.Property(x => x.ExpiredTime).IsRequired();

        }
    }
}
