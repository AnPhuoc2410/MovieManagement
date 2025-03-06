using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.MovieService
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieDto>> GetAllAsync();
        Task<IEnumerable<MoviePreview>> GetPageAsync(int page, int pageSize);
        Task<MovieDto> GetAsync(Guid movieId);
        Task<MovieDto> CreateAsync(Guid employeeId, MovieDto movieDto);
        Task<MovieDto> UpdateAsync(Guid movieId, MovieDto movieDto);
        Task<bool> DeleteAsync(Guid movieId);
        Task<IEnumerable<MoviePreview>> GetMoviesNowShowing(int page, int pageSize);
        Task<IEnumerable<MoviePreview>> GetMoviesUpComing(int page, int pageSize);
        Task<IEnumerable<MoviePreview>> GetMoviesByNameRelative(string name, int page, int pageSize);
        //Task<IEnumerable<MovieDto>> GetMoviesByCategory(Guid categoryId, int page, int pageSize);
        Task<MovieDto> SetMovieDeleted(Guid movieId);
    }
}
