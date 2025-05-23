﻿using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Configurations;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext() { }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<TicketDetail> TicketDetails { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<SeatType> SeatTypes { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<ShowTime> Showtimes { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<MovieCategory> MovieCategories { get; set; }        
        public DbSet<OtpCode> OtpCodes { get; set; }
        public DbSet<MovieTheater> MovieTheaters { get; set; }

        public static string GetConnectionString(string connectionStringName)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            string connectionString = config.GetConnectionString(connectionStringName);
            return connectionString;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //Configure entities
            modelBuilder.ApplyConfiguration(new BillConfiguration());
            modelBuilder.ApplyConfiguration(new TicketDetailConfiguration());
            modelBuilder.ApplyConfiguration(new MovieConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new PromotionConfiguration());
            modelBuilder.ApplyConfiguration(new RoomConfiguration());
            modelBuilder.ApplyConfiguration(new SeatConfiguration());
            modelBuilder.ApplyConfiguration(new ShowtimeConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new MovieCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new SeatTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OtpCodeConfiguration());
            modelBuilder.ApplyConfiguration(new MovieTheaterConfiguration());

            base.OnModelCreating(modelBuilder);
            // Configure relationships if needed
        }
    }

}
