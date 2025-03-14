using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IRoomRepository : IGenericRepository<Room>
    {

        public Task<Room> GetRoomInfo(Guid roomId);

    }
}
