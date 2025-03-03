using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowtimeDto> CreateShowtimeAsync(ShowtimeDto showtime);
        Task<ShowtimeDto> GetShowtimeByComposeIdAsync(Guid movieId, Guid roomId);
        Task<IEnumerable<ShowtimeDto>> GetShowtimePageAsync(int page, int pageSize);
        Task<IEnumerable<ShowtimeDto>> GetAllShowtimeAsync();
        Task<ShowtimeDto> UpdateShowtimeAsync(Guid movieId, Guid roomId, ShowtimeDto showtime);
        Task<bool> DeleteShowtimeAsync(Guid movieId, Guid roomId);
    }
}
