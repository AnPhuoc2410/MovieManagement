using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "PROMOTION",
                type: "Nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "Nvarchar(50)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "PROMOTION",
                type: "Nvarchar(50)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "Nvarchar(max)");
        }
    }
}
