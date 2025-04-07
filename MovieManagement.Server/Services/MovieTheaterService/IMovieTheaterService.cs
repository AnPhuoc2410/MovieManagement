using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.MovieTheaterService
{
    public interface IMovieTheaterService
    {

        Task<IEnumerable<MovieTheaterDto>> GetAllMovieTheatersAsync();
        Task<IEnumerable<MovieTheaterDto>> GetMovieTheaterPageAsync(int page, int pageSize);
        Task<MovieTheaterDto> GetMovieTheaterByIdAsync(Guid movieTheaterId);
        Task<MovieTheaterDto> CreateMovieTheaterAsync(MovieTheaterDto movieTheater);
        Task<MovieTheaterDto> UpdateMovieTheaterAsync(Guid movieTheaterId, MovieTheaterDto movieTheater);
        Task<bool> DeleteMovieTheaterAsync(Guid movieTheaterId);



    }
}
