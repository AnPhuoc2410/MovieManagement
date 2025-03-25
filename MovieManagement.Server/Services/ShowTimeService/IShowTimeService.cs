using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowTimeDto> CreateShowtimeAsync(ShowTimeDto showtime);
        Task<ShowTimeDto> GetShowtimeByIdAsync(Guid showTimeId);
        Task<IEnumerable<ShowTimeDto>> GetShowtimePageAsync(int page, int pageSize);
        Task<IEnumerable<ShowTimeInfo>> GetAllShowtime();
        Task<ShowTimeDto> UpdateShowtimeAsync(Guid showTimeId, ShowTimeDto showtime);
        Task<bool> DeleteShowtimeAsync(Guid showTimeId);

        Task<Dictionary<DateTime, List<ShowTimeDto>>> GetShowTimeFromDateToDate(Guid movieId, DateTime fromDate, DateTime toDate);
    }
}