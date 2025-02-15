using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class aaaa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PROMOTION_BILL_PromotionId",
                table: "PROMOTION");

            migrationBuilder.AlterColumn<string>(
                name: "PromotionId",
                table: "BILL",
                type: "varchar(10)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_BILL_PromotionId",
                table: "BILL",
                column: "PromotionId");

            migrationBuilder.AddForeignKey(
                name: "FK_BILL_PROMOTION_PromotionId",
                table: "BILL",
                column: "PromotionId",
                principalTable: "PROMOTION",
                principalColumn: "PromotionId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BILL_PROMOTION_PromotionId",
                table: "BILL");

            migrationBuilder.DropIndex(
                name: "IX_BILL_PromotionId",
                table: "BILL");

            migrationBuilder.AlterColumn<int>(
                name: "PromotionId",
                table: "BILL",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(10)");

            migrationBuilder.AddForeignKey(
                name: "FK_PROMOTION_BILL_PromotionId",
                table: "PROMOTION",
                column: "PromotionId",
                principalTable: "BILL",
                principalColumn: "BillId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
