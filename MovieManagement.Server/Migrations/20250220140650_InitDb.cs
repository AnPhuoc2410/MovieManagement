using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GIAVE",
                columns: table => new
                {
                    MaGiaVe = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LoaiNgay = table.Column<int>(type: "integer", nullable: false),
                    MocGio = table.Column<int>(type: "integer", nullable: false),
                    DoiTuong = table.Column<int>(type: "integer", nullable: false),
                    PhienBan = table.Column<int>(type: "integer", nullable: false),
                    GiaVe = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GIAVE", x => x.MaGiaVe);
                });

            migrationBuilder.CreateTable(
                name: "KHUYENMAI",
                columns: table => new
                {
                    MaKhuyenMai = table.Column<string>(type: "text", nullable: false),
                    HinhAnh = table.Column<string>(type: "text", nullable: false),
                    TuNgay = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    DenNgay = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    GiamGiaVe = table.Column<decimal>(type: "numeric", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KHUYENMAI", x => x.MaKhuyenMai);
                });

            migrationBuilder.CreateTable(
                name: "NHANVIEN",
                columns: table => new
                {
                    MaNhanVien = table.Column<string>(type: "text", nullable: false),
                    TenTaiKhoan = table.Column<string>(type: "text", nullable: false),
                    MatKhau = table.Column<string>(type: "text", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "text", nullable: false),
                    NgayThamGia = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    HoTen = table.Column<string>(type: "text", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    GioiTinh = table.Column<int>(type: "integer", nullable: false),
                    CMND = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    SDT = table.Column<string>(type: "text", nullable: false),
                    DiaChi = table.Column<string>(type: "text", nullable: false),
                    TrangThai = table.Column<int>(type: "integer", nullable: false),
                    CapDo = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NHANVIEN", x => x.MaNhanVien);
                });

            migrationBuilder.CreateTable(
                name: "PHIM",
                columns: table => new
                {
                    MaPhim = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenPhim = table.Column<string>(type: "text", nullable: false),
                    HinhAnh = table.Column<string>(type: "text", nullable: false),
                    NgayDang = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    TuNgay = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    DenNgay = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    DienVien = table.Column<string>(type: "text", nullable: false),
                    DaoDien = table.Column<string>(type: "text", nullable: false),
                    Hang = table.Column<string>(type: "text", nullable: false),
                    ThoiLuong = table.Column<int>(type: "integer", nullable: false),
                    PhienBan = table.Column<int>(type: "integer", nullable: false),
                    Trailer = table.Column<string>(type: "text", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    MaNhanVien = table.Column<string>(type: "text", nullable: false),
                    MaPhong = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHIM", x => x.MaPhim);
                });

            migrationBuilder.CreateTable(
                name: "PHONGCHIEU",
                columns: table => new
                {
                    MaPhong = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenPhong = table.Column<string>(type: "text", nullable: false),
                    HangGhe = table.Column<int>(type: "integer", nullable: false),
                    CotGhe = table.Column<int>(type: "integer", nullable: false),
                    TongSoGhe = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHONGCHIEU", x => x.MaPhong);
                });

            migrationBuilder.CreateTable(
                name: "THANHVIEN",
                columns: table => new
                {
                    MaNhanVien = table.Column<string>(type: "text", nullable: false),
                    TenTaiKhoan = table.Column<string>(type: "text", nullable: false),
                    MatKhau = table.Column<string>(type: "text", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "text", nullable: false),
                    NgayThamGia = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    HoTen = table.Column<string>(type: "text", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    GioiTinh = table.Column<int>(type: "integer", nullable: false),
                    CMND = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    SDT = table.Column<string>(type: "text", nullable: false),
                    DiaChi = table.Column<string>(type: "text", nullable: false),
                    DiemTichLuy = table.Column<decimal>(type: "numeric", nullable: false),
                    TrangThai = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THANHVIEN", x => x.MaNhanVien);
                });

            migrationBuilder.CreateTable(
                name: "THELOAI",
                columns: table => new
                {
                    MaTheLoai = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenTheLoai = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THELOAI", x => x.MaTheLoai);
                });

            migrationBuilder.CreateTable(
                name: "HOADONBANVE",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "text", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    DiemDoiVe = table.Column<decimal>(type: "numeric", nullable: false),
                    SoLuongDoiVe = table.Column<int>(type: "integer", nullable: false),
                    TongTien = table.Column<decimal>(type: "numeric", nullable: false),
                    MaPhim = table.Column<string>(type: "text", nullable: false),
                    XuatChieu = table.Column<TimeSpan>(type: "interval", nullable: false),
                    MaThanhVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    MaNhanVien = table.Column<string>(type: "varchar(10)", nullable: false),
                    MaKhuyenMai = table.Column<int>(type: "integer", nullable: false),
                    TrangThai = table.Column<int>(type: "integer", nullable: false),
                    NhanVienMaNhanVien = table.Column<string>(type: "text", nullable: true)
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
                name: "XUATCHIEU",
                columns: table => new
                {
                    MaPhim = table.Column<int>(type: "integer", nullable: false),
                    XuatChieu = table.Column<TimeSpan>(type: "interval", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_XUATCHIEU", x => x.MaPhim);
                    table.ForeignKey(
                        name: "FK_XUATCHIEU_PHIM_MaPhim",
                        column: x => x.MaPhim,
                        principalTable: "PHIM",
                        principalColumn: "MaPhim",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GHE",
                columns: table => new
                {
                    MaGhe = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Hang = table.Column<string>(type: "text", nullable: false),
                    SoGhe = table.Column<int>(type: "integer", nullable: false),
                    LoaiGhe = table.Column<int>(type: "integer", nullable: false),
                    MaPhong = table.Column<int>(type: "integer", nullable: false)
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
                    MaPhim = table.Column<int>(type: "integer", nullable: false),
                    MaTheLoai = table.Column<int>(type: "integer", nullable: false)
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
                    MaHoaDon = table.Column<string>(type: "text", nullable: false),
                    MaGhe = table.Column<int>(type: "integer", nullable: false),
                    GiaVe = table.Column<int>(type: "integer", nullable: false)
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
                name: "GIAVE");

            migrationBuilder.DropTable(
                name: "KHUYENMAI");

            migrationBuilder.DropTable(
                name: "THANHVIEN");

            migrationBuilder.DropTable(
                name: "XUATCHIEU");

            migrationBuilder.DropTable(
                name: "HOADONBANVE");

            migrationBuilder.DropTable(
                name: "THELOAI");

            migrationBuilder.DropTable(
                name: "PHONGCHIEU");

            migrationBuilder.DropTable(
                name: "PHIM");

            migrationBuilder.DropTable(
                name: "NHANVIEN");
        }
    }
}
