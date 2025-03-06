using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MovieCategoryService
{
    public interface IMovieCategoryService
    {
        Task<MovieCategory> CreateAsync(MovieCategory movieCategory);
        Task<MovieCategory> GetByIdAsync(Guid ticketId);
        Task<IEnumerable<MovieCategory>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<MovieCategory>> GetAllAsync();
        Task<MovieCategory> UpdateAsync(Guid id, MovieCategory movieCategory);
        Task<bool> DeleteAsync(Guid id);
    }
}
