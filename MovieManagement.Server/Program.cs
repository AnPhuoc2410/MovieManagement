using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Extensions;

namespace MovieManagement.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            // Đăng ký DbContext
            // su dung SQL Server option
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            // Đăng ký UnitOfWork
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();


            // Đăng Ký GenericRepository, Repository và Service
            builder.Services.AddAllDependencies("Repository", "Service", "UnitOfWork");

            // Đăng ký AutoMapper
            builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy => policy.WithOrigins("https://localhost:7119", "https://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
            builder.Services.AddSwaggerGen();

            var app = builder.Build();


            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Check khi nao Migration se duoc apply
            if (builder.Configuration.GetValue<bool>("ApplyMigrations", false))
            {
                app.ApplyMigrations();
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                // Only apply migrations if explicitly enabled in configuration

                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            //Enable Websocket support
            app.UseWebSockets();
            app.UseRouting();

            app.UseAuthorization();

            app.MapControllers();
            app.UseCors("AllowReactApp");

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}