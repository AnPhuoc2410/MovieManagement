using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<Room> GetRoomByIdAsync(Guid roomId);
        //renaming please
        Task<Room> CreateRoomAsync(Room room);
        Task<Room> UpdateRoomAsync(Guid roomId, RoomDto roomDto);
        Task<bool> DeleteRoomAsync(Guid roomId);
    }
}
