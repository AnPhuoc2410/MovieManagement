using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IMovieCategoryRepository : IGenericRepository<MovieCategory>
    {
        List<MovieCategory> GetMovieCategoriesByMovieId(Guid movieId);
    }
}
