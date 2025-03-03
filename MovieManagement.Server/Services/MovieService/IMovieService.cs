using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.MovieService
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieDto>> GetAllMoviesAsync();
        Task<IEnumerable<MovieDto>> GetMoviePageAsync(int page, int pageSize);
        Task<MovieDto> GetMovieByIdAsync(Guid movieId);
        Task<MovieDto> CreateMovieAsync(Guid userId, MovieDto movieDto);
        Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieDto movieDto);
        Task<bool> DeleteMovieAsync(Guid movieId);
    }
}
