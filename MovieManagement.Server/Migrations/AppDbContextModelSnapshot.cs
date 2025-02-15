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
                        .HasColumnType("varchar(11)");

                    b.Property<decimal>("Point")
                        .HasColumnType("numeric(10,2)");

                    b.Property<int>("PromotionId")
                        .HasColumnType("int");

                    b.Property<TimeSpan>("Showtime")
                        .HasColumnType("time");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<int>("TotalTicket")
                        .HasColumnType("int");

                    b.HasKey("BillId");

                    b.HasIndex("EmployeeId");

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
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("CategoryId");

                    b.ToTable("CATEGORY");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.CategoryDetail", b =>
                {
                    b.Property<int>("MovieId")
                        .HasColumnType("int");

                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.HasKey("MovieId", "CategoryId");

                    b.HasIndex("CategoryId");

                    b.ToTable("CATEGORYDETAIL");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Employee", b =>
                {
                    b.Property<string>("EmployeeId")
                        .HasColumnType("varchar(10)");

                    b.Property<string>("AccountName")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<string>("IDCard")
                        .IsRequired()
                        .HasColumnType("nvarchar(15)");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Level")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(11)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("EmployeeId");

                    b.ToTable("EMPLOYEE");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Member", b =>
                {
                    b.Property<string>("MemberId")
                        .HasColumnType("varchar(10)");

                    b.Property<string>("AccountName")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<string>("IDCard")
                        .IsRequired()
                        .HasColumnType("nvarchar(15)");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(11)");

                    b.Property<decimal>("Point")
                        .HasColumnType("numeric(10,2)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("MemberId");

                    b.ToTable("MEMBER");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Movie", b =>
                {
                    b.Property<int>("MovieId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("MovieId"));

                    b.Property<string>("Actors")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Director")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)");

                    b.Property<int>("Duration")
                        .HasColumnType("int");

                    b.Property<string>("EmployeeId")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("PostDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Rating")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)");

                    b.Property<string>("RoomId")
                        .IsRequired()
                        .HasColumnType("varchar(10)");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Trailer")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.HasKey("MovieId");

                    b.ToTable("MOVIE");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Promotion", b =>
                {
                    b.Property<string>("PromotionId")
                        .HasColumnType("varchar(10)");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)");

                    b.Property<decimal>("Discount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("datetime2");

                    b.HasKey("PromotionId");

                    b.ToTable("PROMOTION");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Room", b =>
                {
                    b.Property<int>("RoomId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoomId"));

                    b.Property<int>("Column")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(20)");

                    b.Property<int>("Row")
                        .HasColumnType("int");

                    b.Property<int>("Total")
                        .HasColumnType("int");

                    b.HasKey("RoomId");

                    b.ToTable("ROOM");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Seat", b =>
                {
                    b.Property<int>("SeatId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SeatId"));

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasColumnType("varchar(1)");

                    b.Property<int>("Number")
                        .HasColumnType("int");

                    b.Property<int>("RoomId")
                        .HasColumnType("int");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("SeatId");

                    b.HasIndex("RoomId");

                    b.ToTable("SEAT");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Showtime", b =>
                {
                    b.Property<int>("MovieId")
                        .HasColumnType("int")
                        .HasColumnOrder(0);

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("time")
                        .HasColumnOrder(1);

                    b.HasKey("MovieId", "StartTime");

                    b.ToTable("SHOWTIME");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.TicketDetail", b =>
                {
                    b.Property<string>("BillId")
                        .HasColumnType("varchar(10)");

                    b.Property<int>("SeatId")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.HasKey("BillId", "SeatId");

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
                        .HasColumnType("decimal(10,2)");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("TICKETTYPE");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Bill", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Employee", null)
                        .WithMany("Bills")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.CategoryDetail", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MovieManagement.Server.Models.Entities.Movie", "Movie")
                        .WithMany()
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Movie");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Seat", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Room", "Room")
                        .WithMany()
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Room");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Showtime", b =>
                {
                    b.HasOne("MovieManagement.Server.Models.Entities.Movie", "Movie")
                        .WithMany()
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

                    b.Navigation("Bill");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Bill", b =>
                {
                    b.Navigation("TicketDetails");
                });

            modelBuilder.Entity("MovieManagement.Server.Models.Entities.Employee", b =>
                {
                    b.Navigation("Bills");
                });
#pragma warning restore 612, 618
        }
    }
}
