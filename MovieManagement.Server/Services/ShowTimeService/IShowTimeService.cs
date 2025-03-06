using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowTimeDto> CreateAsync(ShowTimeDto showtime);
        Task<ShowTimeDto> GetByIdAsync(Guid showTimeId);
        Task<IEnumerable<ShowTimeDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<ShowTimeDto>> GetAll();
        Task<ShowTimeDto> UpdateAsync(Guid showTimeId, ShowTimeDto showtime);
        Task<bool> DeleteAsync(Guid showTimeId);
        Task<Dictionary<DateTime, List<ShowTimeDto>>> GetShowTimeFromDateToDate(Guid movieId, DateTime fromDate, DateTime toDate);
    }
}
