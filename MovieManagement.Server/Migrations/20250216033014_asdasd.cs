using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class asdasd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Hungdeptrai",
                table: "BILL",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hungdeptrai",
                table: "BILL");
        }
    }
}
