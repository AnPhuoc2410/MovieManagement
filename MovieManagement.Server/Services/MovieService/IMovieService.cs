using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.MovieService
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieDto>> GetAllMoviesAsync();
        Task<MovieDto> GetMovieByIdAsync(Guid movieId);
        Task<MovieDto> CreateMovieAsync(Guid employeeId, MovieDto movieDto);
        Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieDto movieDto);
        Task<bool> DeleteMovieAsync(Guid movieId);
        Task<IEnumerable<MovieDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<MovieDto>> GetMoviesNowShowing(int page, int pageSize);
        Task<IEnumerable<MovieDto>> GetMoviesUpComing(int page, int pageSize);
        Task<IEnumerable<MovieDto>> GetMoviesByNameRelative(string name, int page, int pageSize);
    }
}
