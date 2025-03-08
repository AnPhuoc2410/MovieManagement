using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface ISeatRepository : IGenericRepository<Seat>
    {
        public Task<List<Seat>> GetByRoomIdAsync(Guid roomId);
    }
}
