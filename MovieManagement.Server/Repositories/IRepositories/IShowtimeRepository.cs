using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IShowtimeRepository : IGenericRepository<ShowTime>
    {
        Task<bool> CheckStartTimeAsync(DateTime startTime);
        Task<List<ShowTime>> GetShowTimeByRoomIdAsync(Guid roomId);
        Task<List<ShowTime>> GetShowTimeFromDateToDate(Guid movieId, DateTime date1, DateTime date2);

        Task<List<ShowTime>> GetAllInfoAsync();
    }
}
