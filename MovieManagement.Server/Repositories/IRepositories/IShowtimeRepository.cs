using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IShowtimeRepository : IGenericRepository<ShowTime>
    {
        public Task<List<ShowTime>> GetShowTimeByRoomIdAsync(Guid roomId);
        Task<List<ShowTime>> GetShowTimeFromDateToDate(Guid movieId, DateTime date1, DateTime date2);
    }
}
