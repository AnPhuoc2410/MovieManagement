using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Extensions.RemoveVietnamese;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories.IRepositories;
using System.Buffers;
using System.Drawing.Printing;
using static MovieManagement.Server.Models.Enums.BillEnum;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Repositories
{
    public class MovieRepository : GenericRepository<Movie>, IMovieRepository
    {
        private readonly AppDbContext _context;
        public MovieRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Movie>> GetMoviesNowShowing(int page, int pageSize)
        {
            return await _context.Movies
                .Where(m => m.FromDate <= DateTime.Now && m.ToDate >= DateTime.Now && m.IsDeleted == false)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesUpComing(int page, int pageSize)
        {
            return await _context.Movies
                .Where(m => m.FromDate > DateTime.Now && m.IsDeleted == false)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesByNameRelativePage(string name, int page, int pageSize)
        {
            var searchValue = VietnameseConverter.RemoveVietnameseDiacritics(name);
            return await _context.Movies
                .Where(m => m.SearchString.ToLower().Contains(searchValue.ToLower()) && m.IsDeleted == false)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public Task<List<Movie>> GetMoviesByCategory(Guid categoryId, int page, int pageSize)
        {
            var query = from m in _context.Movies
                        join mc in _context.MovieCategories on m.MovieId equals mc.MovieId
                        where mc.CategoryId == categoryId && m.IsDeleted == false
                        select m;
            return query.Skip(page * pageSize).Take(pageSize).ToListAsync();
        }

        public Task<List<Movie>> GetMovieByPage(int page, int pageSize)
        {
            return _context.Movies
                .Where(m => m.IsDeleted == false)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public Task<Movie?> GetMovieById(Guid movieId)
        {
            return _context.Movies
                .Where(m => m.MovieId == movieId && m.IsDeleted == false)
                .FirstOrDefaultAsync();
        }

        public async Task<Movie?> SetMovieDeleted(Guid movieId)
        {
            var movie = _context.Movies.Find(movieId);
            if (movie == null)
                throw new NotFoundException("Movie not found!");

            movie.IsDeleted = true;
            await _context.SaveChangesAsync();
            return movie;
        }

        public async Task<List<Movie>> GetMoviesByNameRelative(string searchValue)
        {
            searchValue = VietnameseConverter.RemoveVietnameseDiacritics(searchValue);
            return await _context.Movies
                .Where(m => m.SearchString.ToLower().Contains(searchValue.ToLower()) && m.IsDeleted == false).ToListAsync();
        }

        public async Task<List<Movie>> GetAllAsyncDeletedFalse()
        {
            return await _context.Movies.Where(m => m.IsDeleted == false).ToListAsync();
        }

        public async Task<List<TopMovieResponse.MovieRevenue>> GetTopMovieRevenue()
        {
            var movieRevenue = await _context.Movies
                .Select(m => new
                {
                    m.MovieName,
                    Revenue = m.Showtimes
                       .SelectMany(st => st.TicketDetails
                            .Where(td => td.Status == TicketStatus.Paid
                                        && td.Bill != null
                                        && td.Bill.Status == BillStatus.Completed)
                            .Select(td => td.Bill.Amount))
                        .Sum()
                })
                .OrderByDescending(m => m.Revenue)
                .Take(5)
                .ToListAsync();

            return movieRevenue.Select(mr => new TopMovieResponse.MovieRevenue
            {
                MovieName = mr.MovieName,
                Revenue = mr.Revenue
            }).ToList();
        }

        public async Task<TopMovieResponse.MovieDaily> GetTopMovieDailyRevenue(DateTime time)
        {
            var movieRevenue = await _context.Movies
                .Where(m => m.Showtimes.Any(st => st.TicketDetails.Any(td => td.Bill.CreatedDate.Day == time.Day && td.Bill.Amount > 0)))
                .Select(m => new
                {
                    m.MovieName,
                    Revenue = m.Showtimes
                       .SelectMany(st => st.TicketDetails
                            .Where(td => td.Status == TicketStatus.Paid && td.Bill.Status == BillStatus.Completed)
                            .Select(td => td.Bill))
                        .GroupBy(b => b.BillId)
                        .Select(g => g.FirstOrDefault().Amount)
                        .Sum()
                })
                .OrderByDescending(m => m.Revenue)
                .ToListAsync();

            return new TopMovieResponse.MovieDaily
            {
                Day = time,
                MovieRevenues = movieRevenue.Select(mr => new TopMovieResponse.MovieRevenue
                {
                    MovieName = mr.MovieName,
                    Revenue = mr.Revenue
                }).ToList()
            };
        }

        public async Task<List<long>> TotalMovieDailyLast30Days()
        {
            var currentDate = DateTime.Now;
            var last30Days = Enumerable.Range(0, 30)
                .Select(offset => currentDate.AddDays(-offset))
                .ToList();
            var movieCounts = new List<long>();
            foreach (var date in last30Days)
            {
                var count = await _context.Movies
                    .Where(m => m.PostDate.Date == date.Date)
                    .CountAsync();
                movieCounts.Add(count);
            }
            movieCounts.Reverse();
            return movieCounts;
        }
    }
}
