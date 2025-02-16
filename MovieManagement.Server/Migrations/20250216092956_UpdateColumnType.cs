using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColumnType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PROMOTION",
                type: "ntext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "Nvarchar(500)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "PROMOTION",
                type: "Nvarchar(500)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "ntext");
        }
    }
}
