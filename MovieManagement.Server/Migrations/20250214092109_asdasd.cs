using System;
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
            migrationBuilder.CreateTable(
                name: "CATEGORY",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CATEGORY", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "EMPLOYEE",
                columns: table => new
                {
                    EmployeeId = table.Column<string>(type: "varchar(10)", nullable: false),
                    AccountName = table.Column<string>(type: "varchar(20)", nullable: false),
                    Password = table.Column<string>(type: "varchar(50)", nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    IDCard = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(11)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EMPLOYEE", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "MEMBER",
                columns: table => new
                {
                    MemberId = table.Column<string>(type: "varchar(10)", nullable: false),
                    AccountName = table.Column<string>(type: "varchar(20)", nullable: false),
                    Password = table.Column<string>(type: "varchar(50)", nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    IDCard = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(11)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Point = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MEMBER", x => x.MemberId);
                });

            migrationBuilder.CreateTable(
                name: "MOVIE",
                columns: table => new
                {
                    MovieId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    PostDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FromDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ToDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Actors = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Director = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    Rating = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Trailer = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    EmployeeId = table.Column<string>(type: "varchar(10)", nullable: false),
                    RoomId = table.Column<string>(type: "varchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MOVIE", x => x.MovieId);
                });

            migrationBuilder.CreateTable(
                name: "PROMOTION",
                columns: table => new
                {
                    PromotionId = table.Column<string>(type: "varchar(10)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    FromDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ToDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PROMOTION", x => x.PromotionId);
                });

            migrationBuilder.CreateTable(
                name: "ROOM",
                columns: table => new
                {
                    RoomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(20)", nullable: false),
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    Hours = table.Column<int>(type: "int", nullable: false),
                    Consumer = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKETTYPE", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BILL",
                columns: table => new
                {
                    BillId = table.Column<string>(type: "varchar(10)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Point = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    TotalTicket = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    MovieId = table.Column<string>(type: "varchar(11)", nullable: false),
                    Showtime = table.Column<TimeSpan>(type: "time", nullable: false),
                    MemberId = table.Column<string>(type: "varchar(10)", nullable: false),
                    EmployeeId = table.Column<string>(type: "varchar(10)", nullable: false),
                    PromotionId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BILL", x => x.BillId);
                    table.ForeignKey(
                        name: "FK_BILL_EMPLOYEE_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "EMPLOYEE",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CATEGORYDETAIL",
                columns: table => new
                {
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
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
                name: "SHOWTIME",
                columns: table => new
                {
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SHOWTIME", x => new { x.MovieId, x.StartTime });
                    table.ForeignKey(
                        name: "FK_SHOWTIME_MOVIE_MovieId",
                        column: x => x.MovieId,
                        principalTable: "MOVIE",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SEAT",
                columns: table => new
                {
                    SeatId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Level = table.Column<string>(type: "varchar(1)", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false)
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
                name: "TICKETDETAIL",
                columns: table => new
                {
                    BillId = table.Column<string>(type: "varchar(10)", nullable: false),
                    SeatId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKETDETAIL", x => new { x.BillId, x.SeatId });
                    table.ForeignKey(
                        name: "FK_TICKETDETAIL_BILL_BillId",
                        column: x => x.BillId,
                        principalTable: "BILL",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BILL_EmployeeId",
                table: "BILL",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_CATEGORYDETAIL_CategoryId",
                table: "CATEGORYDETAIL",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SEAT_RoomId",
                table: "SEAT",
                column: "RoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CATEGORYDETAIL");

            migrationBuilder.DropTable(
                name: "MEMBER");

            migrationBuilder.DropTable(
                name: "PROMOTION");

            migrationBuilder.DropTable(
                name: "SEAT");

            migrationBuilder.DropTable(
                name: "SHOWTIME");

            migrationBuilder.DropTable(
                name: "TICKETDETAIL");

            migrationBuilder.DropTable(
                name: "TICKETTYPE");

            migrationBuilder.DropTable(
                name: "CATEGORY");

            migrationBuilder.DropTable(
                name: "ROOM");

            migrationBuilder.DropTable(
                name: "MOVIE");

            migrationBuilder.DropTable(
                name: "BILL");

            migrationBuilder.DropTable(
                name: "EMPLOYEE");
        }
    }
}
