using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Models.Configurations
{
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {

            builder.ToTable("EMPLOYEE");
            builder.HasKey(x => x.EmployeeId);
            //builder.Property(x => x.EmployeeId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.AccountName).HasColumnType("Varchar(20)");
            builder.Property(x => x.AccountName).HasColumnType("varchar(20)");
            builder.Property(x => x.Avatar).HasColumnType("varchar(50)");
            builder.Property(x => x.FullName).HasColumnType("varchar(30)");
            builder.Property(x => x.IDCard).HasColumnType("varchar(15)");
            builder.Property(x => x.Email).HasColumnType("varchar(50)");
            builder.Property(x => x.PhoneNumber).HasColumnType("varchar(11)");
            builder.Property(x => x.Address).HasColumnType("varchar(50)");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.Employee)
                .HasForeignKey(x => x.EmployeeId);

        }
    }
}
