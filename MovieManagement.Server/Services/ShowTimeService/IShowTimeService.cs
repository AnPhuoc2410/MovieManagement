using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowTimeDto> CreateShowTime(ShowTimeDto showtime);
        Task<ShowTimeDto> GetShowtime(Guid movieId, Guid roomId);
        Task<IEnumerable<ShowTimeDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<ShowTimeDto>> GetAllShowtime();
        Task<ShowTimeDto> UpdateShowTime(Guid movieId, Guid roomId, ShowTimeDto showtime);
        Task<bool> DeleteShowtime(Guid movieId, Guid roomId);
    }
}
