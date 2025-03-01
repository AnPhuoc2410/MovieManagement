using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieManagement.Server.Data;
using MovieManagement.Server.Extensions;
using System.Text;

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

            //Đăng ký JWT Authentication
            //builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //    .AddJwtBearer(options =>
            //    {
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateLifetime = true,
            //            ValidateIssuerSigningKey = true,
            //            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            //            ValidAudience = builder.Configuration["Jwt:Audience"],
            //            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
            //        };
            //    });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin", policy => policy.RequireClaim("Role", "0"));
                options.AddPolicy("Manager", policy => policy.RequireClaim("Role", "1"));
                options.AddPolicy("Employy", policy => policy.RequireClaim("Role", "2"));
            });

            // Đăng ký JwtService
            //builder.Services.AddScoped<IJwtService, JwtService>();

            // Đăng ký DbContext
            // su dung SQL Server option
            //builder.Services.AddDbContext<AppDbContext>(options =>
            //    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            //);


            // su dung Postgres option
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection"),
                    npgsqlOptionsAction: sqlOptions =>
                    {
                        sqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorCodesToAdd: null);

                        // Add this line to ensure UTC timestamps
                        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
                    });
            });

            // Đăng ký UnitOfWork
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Đăng ký JwtService
            //builder.Services.AddScoped<JwtService>();

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


            //builder.Services.AddDbContext<AppDbContext>(options =>
            //{
            //    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection"),
            //        npgsqlOptionsAction: sqlOptions =>
            //        {
            //            sqlOptions.EnableRetryOnFailure(
            //                maxRetryCount: 5,
            //                maxRetryDelay: TimeSpan.FromSeconds(30),
            //                errorCodesToAdd: null);

            //            // Add this line to ensure UTC timestamps
            //            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            //        });
            //});



            var app = builder.Build();


            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Check khi nao Migration se duoc apply
            //if (builder.Configuration.GetValue<bool>("ApplyMigrations", false))
            //{
            //    app.ApplyMigrations();
            //}

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