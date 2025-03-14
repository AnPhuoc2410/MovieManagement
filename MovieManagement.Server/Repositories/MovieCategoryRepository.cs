using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class MovieCategoryRepository : GenericRepository<MovieCategory>, IMovieCategoryRepository
    {
        private readonly AppDbContext _context;
        public MovieCategoryRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public List<MovieCategory> GetMovieCategoriesByMovieId(Guid movieId)
        {
            return _context.MovieCategories.Where(mc => mc.MovieId == movieId).ToList();
        }
    }
}
