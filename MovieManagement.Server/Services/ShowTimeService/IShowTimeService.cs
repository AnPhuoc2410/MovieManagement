using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowTimeDto> CreateShowtimeAsync(ShowTimeDto showtime);
        Task<ShowTimeDto> GetShowtimeByComposeIdAsync(Guid movieId, Guid roomId);
        Task<IEnumerable<ShowTimeDto>> GetShowtimePageAsync(int page, int pageSize);
        Task<IEnumerable<ShowTimeDto>> GetAllShowtimeAsync();
        Task<ShowTimeDto> UpdateShowtimeAsync(Guid movieId, Guid roomId, ShowTimeDto showtime);
        Task<bool> DeleteShowtimeAsync(Guid movieId, Guid roomId);
    }
}
