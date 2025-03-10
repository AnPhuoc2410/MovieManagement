using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MovieCategoryService
{
    public interface IMovieCategoryService
    {
        Task<MovieCategory> CreateMovieCategoryAsync(MovieCategory movieCategory);
        Task<MovieCategory> GetMovieCategoryByIdAsync(Guid ticketId);
        Task<IEnumerable<MovieCategory>> GetMovieCategoryPageAsync(int page, int pageSize);
        Task<IEnumerable<MovieCategory>> GetAllMovieCategoryAsync();
        Task<MovieCategory> UpdateMovieCategoryAsync(Guid id, MovieCategory movieCategory);
        Task<bool> DeleteMovieCategoryAsync(Guid id);
    }
}
