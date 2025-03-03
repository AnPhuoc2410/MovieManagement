using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.MovieService
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieDto>> GetAllAsync();
        Task<IEnumerable<MovieDto>> GetPageAsync(int page, int pageSize);
        Task<MovieDto> GetAsync(Guid movieId);
        Task<MovieDto> CreateAsync(Guid employeeId, MovieDto movieDto);
        Task<MovieDto> UpdateAsync(Guid movieId, MovieDto movieDto);
        Task<bool> DeleteAsync(Guid movieId);
    }
}
