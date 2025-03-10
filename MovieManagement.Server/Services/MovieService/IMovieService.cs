using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.MovieService
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieDto>> GetAllMoviesAsync();
        Task<IEnumerable<MoviePreview>> GetPageAsync(int page, int pageSize);
        Task<MovieDto> GetMovieByIdAsync(Guid movieId);
        Task<MovieDto> CreateMovieAsync(Guid employeeId, MovieRequest movieDto);
        Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieRequest movieDto);
        Task<bool> DeleteMovieAsync(Guid movieId);

        Task<IEnumerable<MoviePreview>> GetMoviesNowShowing(int page, int pageSize);
        Task<IEnumerable<MoviePreview>> GetMoviesUpComing(int page, int pageSize);
        Task<IEnumerable<MoviePreview>> GetMoviesByNameRelative(string name, int page, int pageSize);
        //Task<IEnumerable<MovieDto>> GetMoviesByCategory(Guid categoryId, int page, int pageSize);
        Task<MovieDto> SetMovieDeleted(Guid movieId);
    }
}
