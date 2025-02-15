﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MovieManagement.Server.Data;

#nullable disable

namespace MovieManagement.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Bill", b =>
                {
                    b.Property<string>("BillId")
                        .HasColumnType("varchar(10)");

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric(10,2)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("EmployeeId")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<string>("MemberId")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<string>("MovieId")
                        .IsRequired()
                        .HasColumnType("Nvarchar(11)");

                    b.Property<decimal>("Point")
                        .HasColumnType("numeric(10,2)");

                    b.Property<string>("PromotionId")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<TimeSpan>("Showtime")
                        .HasColumnType("time");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<int>("TotalTicket")
                        .HasColumnType("int");

                    b.HasKey("BillId");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("MemberId");

                    b.HasIndex("MovieId");

                    b.HasIndex("PromotionId");

                    b.ToTable("BILL", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .IsUnicode(true)
                        .HasColumnType("Nvarchar(20)");

                    b.HasKey("CategoryId");

                    b.ToTable("CATEGORY", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.CategoryDetail", b =>
                {
                    b.Property<string>("MovieId")
                        .HasColumnType("Nvarchar(11)");

                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.HasKey("MovieId", "CategoryId");

                    b.HasIndex("CategoryId");

                    b.ToTable("CATEGORYDETAIL", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Employee", b =>
                {
                    b.Property<string>("EmployeeId")
                        .HasColumnType("Varchar(10)");

                    b.Property<string>("AccountName")
                        .IsRequired()
                        .HasColumnType("Nvarchar(20)");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("Nvarchar(30)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<string>("IDCard")
                        .IsRequired()
                        .HasColumnType("Nvarchar(15)");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Level")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("Nvarchar(11)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("EmployeeId");

                    b.ToTable("EMPLOYEE", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Member", b =>
                {
                    b.Property<string>("MemberId")
                        .HasColumnType("Varchar(10)");

                    b.Property<string>("AccountName")
                        .IsRequired()
                        .HasColumnType("Nvarchar(20)");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("Nvarchar(30)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<string>("IDCard")
                        .IsRequired()
                        .HasColumnType("Nvarchar(15)");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("Nvarchar(11)");

                    b.Property<decimal>("Point")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("MemberId");

                    b.ToTable("MEMBER", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Movie", b =>
                {
                    b.Property<string>("MovieId")
                        .HasColumnType("Nvarchar(11)");

                    b.Property<string>("Actors")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("Nvarchar(500)");

                    b.Property<string>("Director")
                        .IsRequired()
                        .HasColumnType("Nvarchar(30)");

                    b.Property<int>("Duration")
                        .HasColumnType("int");

                    b.Property<string>("EmployeeId")
                        .IsRequired()
                        .HasColumnType("Nvarchar(10)");

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("Nvarchar(50)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(true)
                        .HasColumnType("Nvarchar(50)");

                    b.Property<DateTime>("PostDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Rating")
                        .IsRequired()
                        .HasColumnType("Nvarchar(30)");

                    b.Property<string>("RoomId")
                        .IsRequired()
                        .HasColumnType("Nvarchar(10)");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Trailer")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.HasKey("MovieId");

                    b.ToTable("MOVIE", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Promotion", b =>
                {
                    b.Property<string>("PromotionId")
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("Nvarchar(500)");

                    b.Property<decimal>("Discount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("datetime2");

                    b.HasKey("PromotionId");

                    b.ToTable("PROMOTION", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Room", b =>
                {
                    b.Property<string>("RoomId")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<int>("Column")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("Nvarchar(50)");

                    b.Property<int>("Row")
                        .HasColumnType("int");

                    b.Property<int>("Total")
                        .HasColumnType("int");

                    b.HasKey("RoomId");

                    b.ToTable("ROOM", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Seat", b =>
                {
                    b.Property<string>("SeatId")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasMaxLength(1)
                        .HasColumnType("varchar(1)");

                    b.Property<int>("Number")
                        .HasColumnType("int");

                    b.Property<string>("RoomId")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("SeatId");

                    b.HasIndex("RoomId");

                    b.ToTable("SEAT", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Showtime", b =>
                {
                    b.Property<string>("MovieId")
                        .HasColumnType("Nvarchar(11)")
                        .HasColumnOrder(0);

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("time")
                        .HasColumnOrder(1);

                    b.HasKey("MovieId", "StartTime");

                    b.ToTable("SHOWTIME", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.TicketDetail", b =>
                {
                    b.Property<string>("BillId")
                        .HasColumnType("varchar(10)");

                    b.Property<string>("SeatId")
                        .HasColumnType("varchar(10)");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.HasKey("BillId", "SeatId");

                    b.HasIndex("SeatId");

                    b.ToTable("TICKETDETAIL", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.TicketType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Consumer")
                        .HasColumnType("int");

                    b.Property<int>("DayOfWeek")
                        .HasColumnType("int");

                    b.Property<int>("Hours")
                        .HasColumnType("int");

                    b.Property<decimal>("Price")
                        .HasPrecision(18)
                        .HasColumnType("decimal(18, 0)");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("TICKETTYPE", (string)null);
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Bill", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Employee", "Employee")
                        .WithMany("Bills")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieManagement.Server.Models.Entities.Member", "Member")
                        .WithMany("Bills")
                        .HasForeignKey("MemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieManagement.Server.Models.Entities.Movie", "Movie")
                        .WithMany("Bills")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieManagement.Server.Models.Entities.Promotion", "Promotion")
                        .WithMany("Bills")
                        .HasForeignKey("PromotionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Member");

                    b.Navigation("Movie");

                    b.Navigation("Promotion");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.CategoryDetail", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Category", "Category")
                        .WithMany("CategoryDetails")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieManagement.Server.Models.Entities.Movie", "Movie")
                        .WithMany("CategoryDetails")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Seat", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Room", "Room")
                        .WithMany("Seats")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Room");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Showtime", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Movie", "Movie")
                        .WithMany("Showtimes")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.TicketDetail", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Bill", "Bill")
                        .WithMany("TicketDetails")
                        .HasForeignKey("BillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieManagement.Server.Models.Entities.Seat", "Seat")
                        .WithMany("TicketDetail")
                        .HasForeignKey("SeatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bill");

                    b.Navigation("Seat");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Bill", b =>
                {
                    b.Navigation("TicketDetails");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Category", b =>
                {
                    b.Navigation("CategoryDetails");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Employee", b =>
                {
                    b.Navigation("Bills");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Member", b =>
                {
                    b.Navigation("Bills");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Movie", b =>
                {
                    b.Navigation("Bills");

                    b.Navigation("CategoryDetails");

                    b.Navigation("Showtimes");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Promotion", b =>
                {
                    b.Navigation("Bills");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Room", b =>
                {
                    b.Navigation("Seats");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Seat", b =>
                {
                    b.Navigation("TicketDetail");
                });
#pragma warning restore 612, 618
        }
    }
}
