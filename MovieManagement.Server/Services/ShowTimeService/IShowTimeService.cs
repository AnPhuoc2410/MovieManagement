using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public interface IShowTimeService
    {
        Task<Showtime> CreateShowTime(Showtime showtime);
        Task<Showtime> GetShowtime(Guid id);
        Task<IEnumerable<Showtime>> GetAllShowtime();
        Task<Showtime> UpdateShowTime(Guid id, Showtime showtime);
        Task<bool> DeleteShowtime(Guid id);
    }
}
