using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class DB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CATEGORY",
                columns: table => new
                {
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Name = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CATEGORY", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "MOVIE",
                columns: table => new
                {
                    MovieId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Image = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    PostDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FromDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ToDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Actors = table.Column<string>(type: "varchar(50)", nullable: false),
                    Director = table.Column<string>(type: "varchar(30)", nullable: false),
                    Rating = table.Column<string>(type: "varchar(30)", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Trailer = table.Column<string>(type: "varchar(50)", nullable: false),
                    Content = table.Column<string>(type: "varchar(500)", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MOVIE", x => x.MovieId);
                });

            migrationBuilder.CreateTable(
                name: "PROMOTION",
                columns: table => new
                {
                    PromotionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PromotionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: false),
                    FromDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ToDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PROMOTION", x => x.PromotionId);
                });

            migrationBuilder.CreateTable(
                name: "ROOM",
                columns: table => new
                {
                    RoomId = table.Column<Guid>(type: "uniqueidentifier", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false),
                    Row = table.Column<int>(type: "int", nullable: false),
                    Column = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ROOM", x => x.RoomId);
                });

            migrationBuilder.CreateTable(
                name: "TICKETTYPE",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    Hours = table.Column<int>(type: "int", nullable: false),
                    Consumer = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,0)", precision: 18, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKETTYPE", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "USER",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    UserName = table.Column<string>(type: "varchar(20)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Avatar = table.Column<string>(type: "varchar(50)", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FullName = table.Column<string>(type: "varchar(30)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    IDCard = table.Column<string>(type: "varchar(15)", nullable: false),
                    Email = table.Column<string>(type: "varchar(50)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(11)", nullable: false),
                    Address = table.Column<string>(type: "varchar(50)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    Point = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_USER", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "CATEGORYDETAIL",
                columns: table => new
                {
                    MovieId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CATEGORYDETAIL", x => new { x.MovieId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_CATEGORYDETAIL_CATEGORY_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "CATEGORY",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CATEGORYDETAIL_MOVIE_MovieId",
                        column: x => x.MovieId,
                        principalTable: "MOVIE",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SEAT",
                columns: table => new
                {
                    SeatId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Level = table.Column<string>(type: "varchar(1)", maxLength: 1, nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SEAT", x => x.SeatId);
                    table.ForeignKey(
                        name: "FK_SEAT_ROOM_RoomId",
                        column: x => x.RoomId,
                        principalTable: "ROOM",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SHOWTIME",
                columns: table => new
                {
                    ShowTimeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MovieId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoomId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SHOWTIME", x => x.ShowTimeId);
                    table.ForeignKey(
                        name: "FK_SHOWTIME_MOVIE_MovieId",
                        column: x => x.MovieId,
                        principalTable: "MOVIE",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SHOWTIME_ROOM_RoomId",
                        column: x => x.RoomId,
                        principalTable: "ROOM",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BILL",
                columns: table => new
                {
                    BillId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Point = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    TotalTicket = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PromotionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BILL", x => x.BillId);
                    table.ForeignKey(
                        name: "FK_BILL_PROMOTION_PromotionId",
                        column: x => x.PromotionId,
                        principalTable: "PROMOTION",
                        principalColumn: "PromotionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BILL_USER_UserId",
                        column: x => x.UserId,
                        principalTable: "USER",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TICKETDETAIL",
                columns: table => new
                {
                    BillId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SeatId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ShowTimeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TicketTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKETDETAIL", x => new { x.BillId, x.SeatId, x.ShowTimeId });
                    table.ForeignKey(
                        name: "FK_TICKETDETAIL_BILL_BillId",
                        column: x => x.BillId,
                        principalTable: "BILL",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TICKETDETAIL_SEAT_SeatId",
                        column: x => x.SeatId,
                        principalTable: "SEAT",
                        principalColumn: "SeatId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TICKETDETAIL_SHOWTIME_ShowTimeId",
                        column: x => x.ShowTimeId,
                        principalTable: "SHOWTIME",
                        principalColumn: "ShowTimeId");
                    table.ForeignKey(
                        name: "FK_TICKETDETAIL_TICKETTYPE_TicketTypeId",
                        column: x => x.TicketTypeId,
                        principalTable: "TICKETTYPE",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BILL_PromotionId",
                table: "BILL",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_BILL_UserId",
                table: "BILL",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CATEGORYDETAIL_CategoryId",
                table: "CATEGORYDETAIL",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SEAT_RoomId",
                table: "SEAT",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_SHOWTIME_MovieId",
                table: "SHOWTIME",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_SHOWTIME_RoomId",
                table: "SHOWTIME",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETDETAIL_SeatId",
                table: "TICKETDETAIL",
                column: "SeatId");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETDETAIL_ShowTimeId",
                table: "TICKETDETAIL",
                column: "ShowTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETDETAIL_TicketTypeId",
                table: "TICKETDETAIL",
                column: "TicketTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CATEGORYDETAIL");

            migrationBuilder.DropTable(
                name: "TICKETDETAIL");

            migrationBuilder.DropTable(
                name: "CATEGORY");

            migrationBuilder.DropTable(
                name: "BILL");

            migrationBuilder.DropTable(
                name: "SEAT");

            migrationBuilder.DropTable(
                name: "SHOWTIME");

            migrationBuilder.DropTable(
                name: "TICKETTYPE");

            migrationBuilder.DropTable(
                name: "PROMOTION");

            migrationBuilder.DropTable(
                name: "USER");

            migrationBuilder.DropTable(
                name: "MOVIE");

            migrationBuilder.DropTable(
                name: "ROOM");
        }
    }
}
