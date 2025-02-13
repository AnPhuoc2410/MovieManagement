using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class MovieManagementMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KHUYENMAI",
                columns: table => new
                {
                    MaKhuyenMai = table.Column<string>(type: "varchar(10)", nullable: false),
                    HinhAnh = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    TuNgay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DenNgay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GiamGiaVe = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(500)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KHUYENMAI", x => x.MaKhuyenMai);
                });

            migrationBuilder.CreateTable(
                name: "NHANVIEN",
                columns: table => new
                {
                    MaNhanVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    TenTaiKhoan = table.Column<string>(type: "varchar(20)", nullable: false),
                    MatKhau = table.Column<string>(type: "varchar(50)", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    NgayThamGia = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GioiTinh = table.Column<int>(type: "int", nullable: false),
                    CMND = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(11)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    TrangThai = table.Column<int>(type: "int", nullable: false),
                    CapDo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NHANVIEN", x => x.MaNhanVien);
                });

            migrationBuilder.CreateTable(
                name: "PHIM",
                columns: table => new
                {
                    MaPhim = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenPhim = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    HinhAnh = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    NgayDang = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TuNgay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DenNgay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DienVien = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DaoDien = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    Hang = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    ThoiLuong = table.Column<int>(type: "int", nullable: false),
                    PhienBan = table.Column<int>(type: "int", nullable: false),
                    Trailer = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    MaNhanVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    MaPhong = table.Column<string>(type: "varchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHIM", x => x.MaPhim);
                });

            migrationBuilder.CreateTable(
                name: "PHONGCHIEU",
                columns: table => new
                {
                    MaPhong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenPhong = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    HangGhe = table.Column<int>(type: "int", nullable: false),
                    CotGhe = table.Column<int>(type: "int", nullable: false),
                    TongSoGhe = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHONGCHIEU", x => x.MaPhong);
                });

            migrationBuilder.CreateTable(
                name: "THANHVIEN",
                columns: table => new
                {
                    MaNhanVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    TenTaiKhoan = table.Column<string>(type: "varchar(20)", nullable: false),
                    MatKhau = table.Column<string>(type: "varchar(50)", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    NgayThamGia = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(30)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GioiTinh = table.Column<int>(type: "int", nullable: false),
                    CMND = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(11)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DiemTichLuy = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    TrangThai = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THANHVIEN", x => x.MaNhanVien);
                });

            migrationBuilder.CreateTable(
                name: "THELOAI",
                columns: table => new
                {
                    MaTheLoai = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenTheLoai = table.Column<string>(type: "nvarchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THELOAI", x => x.MaTheLoai);
                });

            migrationBuilder.CreateTable(
                name: "HOADONBANVE",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "varchar(10)", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DiemDoiVe = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    SoLuongDoiVe = table.Column<int>(type: "int", nullable: false),
                    TongTien = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    MaPhim = table.Column<string>(type: "varchar(11)", nullable: false),
                    XuatChieu = table.Column<TimeSpan>(type: "time", nullable: false),
                    MaThanhVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    MaNhanVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    MaKhuyenMai = table.Column<int>(type: "int", nullable: false),
                    TrangThai = table.Column<int>(type: "int", nullable: false),
                    NhanVienMaNhanVien = table.Column<string>(type: "varchar(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HOADONBANVE", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HOADONBANVE_NHANVIEN_NhanVienMaNhanVien",
                        column: x => x.NhanVienMaNhanVien,
                        principalTable: "NHANVIEN",
                        principalColumn: "MaNhanVien");
                });

            migrationBuilder.CreateTable(
                name: "GHE",
                columns: table => new
                {
                    MaGhe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hang = table.Column<string>(type: "varchar(1)", nullable: false),
                    SoGhe = table.Column<int>(type: "int", nullable: false),
                    LoaiGhe = table.Column<int>(type: "int", nullable: false),
                    MaPhong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GHE", x => x.MaGhe);
                    table.ForeignKey(
                        name: "FK_GHE_PHONGCHIEU_MaPhong",
                        column: x => x.MaPhong,
                        principalTable: "PHONGCHIEU",
                        principalColumn: "MaPhong",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETTHELOAI",
                columns: table => new
                {
                    MaPhim = table.Column<int>(type: "int", nullable: false),
                    MaTheLoai = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETTHELOAI", x => new { x.MaPhim, x.MaTheLoai });
                    table.ForeignKey(
                        name: "FK_CHITIETTHELOAI_PHIM_MaPhim",
                        column: x => x.MaPhim,
                        principalTable: "PHIM",
                        principalColumn: "MaPhim",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETTHELOAI_THELOAI_MaTheLoai",
                        column: x => x.MaTheLoai,
                        principalTable: "THELOAI",
                        principalColumn: "MaTheLoai",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETBANVE",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "varchar(10)", nullable: false),
                    MaGhe = table.Column<int>(type: "int", nullable: false),
                    GiaVe = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETBANVE", x => new { x.MaHoaDon, x.MaGhe });
                    table.ForeignKey(
                        name: "FK_CHITIETBANVE_HOADONBANVE_MaHoaDon",
                        column: x => x.MaHoaDon,
                        principalTable: "HOADONBANVE",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETTHELOAI_MaTheLoai",
                table: "CHITIETTHELOAI",
                column: "MaTheLoai");

            migrationBuilder.CreateIndex(
                name: "IX_GHE_MaPhong",
                table: "GHE",
                column: "MaPhong");

            migrationBuilder.CreateIndex(
                name: "IX_HOADONBANVE_NhanVienMaNhanVien",
                table: "HOADONBANVE",
                column: "NhanVienMaNhanVien");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CHITIETBANVE");

            migrationBuilder.DropTable(
                name: "CHITIETTHELOAI");

            migrationBuilder.DropTable(
                name: "GHE");

            migrationBuilder.DropTable(
                name: "KHUYENMAI");

            migrationBuilder.DropTable(
                name: "THANHVIEN");

            migrationBuilder.DropTable(
                name: "HOADONBANVE");

            migrationBuilder.DropTable(
                name: "PHIM");

            migrationBuilder.DropTable(
                name: "THELOAI");

            migrationBuilder.DropTable(
                name: "PHONGCHIEU");

            migrationBuilder.DropTable(
                name: "NHANVIEN");
        }
    }
}
