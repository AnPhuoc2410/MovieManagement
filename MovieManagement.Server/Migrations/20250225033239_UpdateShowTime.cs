using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShowTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SHOWTIME",
                table: "SHOWTIME");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SHOWTIME",
                table: "SHOWTIME",
                columns: new[] { "MovieId", "RoomId", "StartTime" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SHOWTIME",
                table: "SHOWTIME");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SHOWTIME",
                table: "SHOWTIME",
                columns: new[] { "MovieId", "RoomId" });
        }
    }
}
