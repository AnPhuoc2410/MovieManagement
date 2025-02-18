using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAllRooms();
        Task<Room> GetRoomById(Guid roomId);
        Task<Room> CreateRoom(RoomDto roomDto);
        Task<Room> UpdateRoom(Guid roomId, RoomDto roomDto);
        Task<bool> DeleteRoom(Guid roomId);
    }
}
