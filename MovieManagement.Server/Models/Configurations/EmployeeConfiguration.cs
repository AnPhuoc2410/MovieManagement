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
            builder.Property(x => x.EmployeeId).HasColumnType("Varchar(10)");
            builder.Property(x => x.AccountName).HasColumnType("Varchar(20)");
            builder.Property(x => x.AccountName).HasColumnType("Nvarchar(20)");
            builder.Property(x => x.Avatar).HasColumnType("Nvarchar(50)");

        }
    }
}
