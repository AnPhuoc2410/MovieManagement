using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowtimeDto> CreateShowTime(ShowtimeDto showtime);
        Task<ShowtimeDto> GetShowtime(Guid id);
        Task<IEnumerable<ShowtimeDto>> GetAllShowtime();
        Task<ShowtimeDto> UpdateShowTime(Guid id, ShowtimeDto showtime);
        Task<bool> DeleteShowtime(Guid id);
    }
}
