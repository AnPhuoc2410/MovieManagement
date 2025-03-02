//using Microsoft.EntityFrameworkCore;
//using MovieManagement.Server.Data;
//namespace MovieManagement.Server.Extensions
//{
//    public static class ApplyMigration
//    {
//        public static void ApplyMigrations(this IApplicationBuilder app)
//        {
//            using IServiceScope scope = app.ApplicationServices.CreateScope();
//            using AppDbContext context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

//            try
//            {
//                var retryCount = 0;
//                const int maxRetries = 5;

//                while (retryCount < maxRetries)
//                {
//                    try
//                    {
//                        context.Database.Migrate();
//                        break;
//                    }
//                    catch (Exception ex)
//                    {
//                        retryCount++;
//                        if (retryCount == maxRetries)
//                            throw;

//                        // Wait before the next retry
//                        Thread.Sleep(2000 * retryCount); // Exponential backoff
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();
//                logger.LogError(ex, "An error occurred while migrating the database.");
//                throw;
//            }
//        }
//    }
//}
