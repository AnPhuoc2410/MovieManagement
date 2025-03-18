using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class MovieTheaterRepository : GenericRepository<MovieTheater>, IMovieTheaterRepository
    {
        public MovieTheaterRepository(AppDbContext context) : base(context)
        {
        }
    }
}
