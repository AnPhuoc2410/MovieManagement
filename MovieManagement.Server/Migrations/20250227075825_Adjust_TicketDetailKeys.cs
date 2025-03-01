using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class Adjust_TicketDetailKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TICKETDETAIL",
                table: "TICKETDETAIL");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TICKETDETAIL",
                table: "TICKETDETAIL",
                columns: new[] { "BillId", "SeatId", "ShowTimeId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TICKETDETAIL",
                table: "TICKETDETAIL");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TICKETDETAIL",
                table: "TICKETDETAIL",
                columns: new[] { "BillId", "SeatId" });
        }
    }
}
