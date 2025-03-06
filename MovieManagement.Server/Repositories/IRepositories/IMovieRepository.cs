using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IMovieRepository : IGenericRepository<Movie>
    {
        Task<List<Movie>> GetMoviesNowShowing(int page, int pageSize);
        Task<List<Movie>> GetMoviesUpComing(int page, int pageSize);
        Task<List<Movie>> GetMoviesByNameRelative(string name, int page, int pageSize);
        Task<List<Movie>> GetMoviesByCategory(Guid categoryId);
    }
}
