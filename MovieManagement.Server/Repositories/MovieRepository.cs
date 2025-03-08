using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

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
                .Where(m => m.FromDate <= DateTime.Now && m.ToDate >= DateTime.Now)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesUpComing(int page, int pageSize)
        {
            return await _context.Movies
                .Where(m => m.FromDate > DateTime.Now)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesByNameRelative(string name, int page, int pageSize)
        {
            return await _context.Movies
                .Where(m => m.MovieName.ToLower().Contains(name.ToLower()))
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public Task<List<Movie>> GetMoviesByCategory(Guid categoryId, int page, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<List<Movie>> GetMoviesByCategory(Guid categoryId)
        {
            throw new NotImplementedException();
        }
    }
}
