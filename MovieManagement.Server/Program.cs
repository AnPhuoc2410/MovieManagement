using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ClaimRequest.API.Middlewares;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MovieManagement.Server.Data;
using MovieManagement.Server.Extensions;
using MovieManagement.Server.Extensions.VNPAY.Services;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Services.JwtService;
using Newtonsoft.Json;

namespace MovieManagement.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling =
                        ReferenceLoopHandling.Ignore;
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            //Đăng ký JWT Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
                    };
                });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("Member", policy => policy.RequireClaim(ClaimTypes.Role, UserEnum.Role.Member.ToString()));
                options.AddPolicy("Employee", policy => policy.RequireClaim(ClaimTypes.Role, UserEnum.Role.Employee.ToString()));
                options.AddPolicy("Admin", policy => policy.RequireClaim(ClaimTypes.Role, UserEnum.Role.Admin.ToString()));
            });

            // Đăng ký JwtService
            builder.Services.AddScoped<IJwtService, JwtService>();

            // Đăng ký DbContext
            // su dung SQL Server option
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("PhuocConnection"))
            );

            // Đăng ký UnitOfWork
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Đăng Ký GenericRepository, Repository và Service
            builder.Services.AddAllDependencies("Repository", "Service", "UnitOfWork");

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.DefaultIgnoreCondition =
                    JsonIgnoreCondition.WhenWritingNull;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            // Đăng ký AutoMapper
            builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy => policy.WithOrigins(
                            "https://localhost:3000",
                            "http://localhost:3000",
                            "https://localhost:7119",
                            "https://eigaa.vercel.app")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            // Đăng ký Swagger
            // Setting json inside of appsettings.
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "MovieManagement.Server", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
                // Set the comments path for the Swagger JSON and UI.
                // Set up this in .csproj
                /*

                 <PropertyGroup>
                      <GenerateDocumentationFile>true</GenerateDocumentationFile>
                      <NoWarn>$(NoWarn);1591</NoWarn>
                </PropertyGroup>

                 */
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            // Register the password hasher
            builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            //Enable role based and policy based authorization
            builder.Services.AddAuthorization();

            // Đăng ký VnPayService
            builder.Services.AddSingleton<IVnPayService, VnPayService>();

            builder.Services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true; // Forces lowercase routes
            });


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


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.UseCors("AllowReactApp");

            app.MapFallbackToFile("/index.html");
            app.UseHttpsRedirection();

            // Add the ExceptionHandlerMiddleware to the pipeline
            // comment lai doan code phia duoi neu chuong khong doc duoc loi tu swagger
            // ===============================================
            app.UseMiddleware<ExceptionHandlerMiddleware>();
            // ===============================================

            app.Run();
        }
    }
}