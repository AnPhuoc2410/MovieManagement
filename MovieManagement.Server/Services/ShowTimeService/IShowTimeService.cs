using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<ShowTimeDto> CreateAsync(ShowTimeDto showtime);
        Task<ShowTimeDto> GetByComposeId(Guid movieId, Guid roomId);
        Task<IEnumerable<ShowTimeDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<ShowTimeDto>> GetAll();
        Task<ShowTimeDto> UpdateAsync(Guid movieId, Guid roomId, ShowTimeDto showtime);
        Task<bool> DeleteAsync(Guid movieId, Guid roomId);
    }
}
