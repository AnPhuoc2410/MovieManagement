﻿using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Configurations;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext() { }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<TicketDetail> TicketDetails { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Showtime> Showtimes { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryDetail> CategoryDetails { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }

        public static string GetConnectionString(string connectionStringName)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            string connectionString = config.GetConnectionString(connectionStringName);
            return connectionString;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseSqlServer(GetConnectionString("DefaultConnection"));

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<TicketDetail>()
            //    .HasKey(ct => new { ct.BillId, ct.SeatId });
            //modelBuilder.Entity<TicketDetail>()
            //    .HasOne(t => t.Bill)
            //    .WithMany(b => b.TicketDetails)
            //    .HasForeignKey(t => t.BillId);

            //modelBuilder.Entity<CategoryDetail>()
            //    .HasKey(ct => new { ct.MovieId, ct.CategoryId });

            //modelBuilder.Entity<Showtime>()
            //    .HasKey(ct => new { ct.MovieId, ct.StartTime });

            modelBuilder.ApplyConfiguration(new BillConfiguration());
            modelBuilder.ApplyConfiguration(new TicketDetailConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryDetailConfiguration());
            modelBuilder.ApplyConfiguration(new MovieConfiguration());
            modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
            modelBuilder.ApplyConfiguration(new MemberConfiguration());
            modelBuilder.ApplyConfiguration(new PromotionConfiguration());
            modelBuilder.ApplyConfiguration(new RoomConfiguration());
            modelBuilder.ApplyConfiguration(new SeatConfiguration());
            modelBuilder.ApplyConfiguration(new ShowtimeConfiguration());
            modelBuilder.ApplyConfiguration(new TicketTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryDetailConfiguration());
            modelBuilder.ApplyConfiguration(new TicketDetailConfiguration());


            base.OnModelCreating(modelBuilder);
            // Configure relationships if needed
        }
    }

}
