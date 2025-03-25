using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories.IRepositories;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        private readonly AppDbContext _context;
        public CategoryRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<TopCategoryResponse.CategoryRevenue>> GetCategoryHaveTicketsSold()
        {
            var categoryTicketsSold = await _context.Categories
                .SelectMany(c => c.MovieCategories.Select(mc => new
                {
                    c.Name,
                    TicketsSold = mc.Movie.Showtimes
                    .SelectMany(st => st.TicketDetails)
                    .Where(td => td.Status == TicketStatus.Paid)
                    .Select(td => td.TicketId)
                    .Distinct()
                    .Count()

                }))
                .GroupBy(c => c.Name)
                .Select(g => new
                {
                    CategoryName = g.Key,
                    TicketsSold = (decimal)g.Sum(t => t.TicketsSold)
                })
                .ToListAsync();

            return categoryTicketsSold.Select(cts => new TopCategoryResponse.CategoryRevenue
            {
                CategoryName = cts.CategoryName,
                TicketsSold = cts.TicketsSold
            }).ToList();
        }

        public async Task<TopCategoryResponse.Daily> GetCategoryHaveTicketsSoldDaily(DateTime day)
        {
            var categoryTicketsSold = await _context.Categories
                .SelectMany(c => c.MovieCategories.Select(mc => new
                {
                    c.Name,
                    TicketsSold = mc.Movie.Showtimes
                    .SelectMany(st => st.TicketDetails)
                    .Where(td => td.Status == TicketStatus.Paid && td.Bill.CreatedDate.Date == day.Date)
                    .Select(td => td.TicketId)
                    .Distinct()
                    .Count()
                }))
                .GroupBy(c => c.Name)
                .Select(g => new
                {
                    CategoryName = g.Key,
                    TicketsSold = (decimal)g.Sum(t => t.TicketsSold)
                }).OrderByDescending(g => g.TicketsSold)
                .ToListAsync();
            return new TopCategoryResponse.Daily
            {
                Day = day.Date,
                CategoryRevenues = categoryTicketsSold.Select(cts => new TopCategoryResponse.CategoryRevenue
                {
                    CategoryName = cts.CategoryName,
                    TicketsSold = cts.TicketsSold
                }).ToList()
            };
        }
    }
}