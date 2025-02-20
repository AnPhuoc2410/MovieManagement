using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<NhanVien> NhanViens { get; set; }
        public DbSet<ThanhVien> ThanhViens { get; set; }
        public DbSet<KhuyenMai> KhuyenMais { get; set; }
        public DbSet<HoaDonBanVe> HoaDonBanVes { get; set; }
        public DbSet<ChiTietBanVe> ChiTietBanVes { get; set; }
        public DbSet<Ghe> Ghes { get; set; }
        public DbSet<PhongChieu> PhongChieus { get; set; }
        public DbSet<XuatChieuPhim> XuatChieus { get; set; }
        public DbSet<Phim> Phims { get; set; }
        public DbSet<TheLoai> TheLoais { get; set; }
        public DbSet<ChiTietTheLoai> ChiTietTheLoais { get; set; }
        public DbSet<GiaVePhim> GiaVes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChiTietBanVe>()
                .HasKey(ct => new { ct.MaHoaDon, ct.MaGhe });

            modelBuilder.Entity<ChiTietTheLoai>()
                .HasKey(ct => new { ct.MaPhim, ct.MaTheLoai });

            base.OnModelCreating(modelBuilder);
            // Configure relationships if needed
        }
    }

}
