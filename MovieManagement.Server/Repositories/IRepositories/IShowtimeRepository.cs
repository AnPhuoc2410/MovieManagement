using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IShowtimeRepository : IGenericRepository<ShowTime>
    {
        Task<bool> CheckStartTimeAsync(DateTime startTime);
        Task<List<ShowTime>> GetShowTimeByRoomIdAsync(Guid roomId);
        Task<List<ShowTime>> GetShowTimeFromDateToDate(Guid movieId, DateTime date1, DateTime date2, string location);
        Task<List<ShowTime>> GetAllInfoAsync();

        Task<List<ShowTime>> GetTopShowtimeDailyRevenues(DateTime from, DateTime to, DateTime time);
        Task<List<ShowTime>> GetTopShowtimeRevenues(DateTime time);
    }
}
