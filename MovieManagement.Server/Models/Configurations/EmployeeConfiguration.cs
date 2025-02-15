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
            builder.Property(x => x.EmployeeId).HasDefaultValueSql("NEWID()");
            builder.Property(x => x.AccountName).HasColumnType("Varchar(20)");
            builder.Property(x => x.AccountName).HasColumnType("Nvarchar(20)");
            builder.Property(x => x.Avatar).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.FullName).HasColumnType("Nvarchar(30)");
            builder.Property(x => x.IDCard).HasColumnType("Nvarchar(15)");
            builder.Property(x => x.Email).HasColumnType("Nvarchar(50)");
            builder.Property(x => x.PhoneNumber).HasColumnType("Nvarchar(11)");
            builder.Property(x => x.Address).HasColumnType("Nvarchar(50)");
            builder.HasMany(x => x.Bills)
                .WithOne(x => x.Employee)
                .HasForeignKey(x => x.EmployeeId);

        }
    }
}
