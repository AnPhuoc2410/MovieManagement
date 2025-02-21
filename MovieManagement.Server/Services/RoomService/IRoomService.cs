using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
        Task<RoomDto> GetRoomByIdAsync(Guid roomId);
        //renaming please
        Task<RoomDto> CreateRoomAsync(RoomDto roomDto);
        Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto roomDto);
        Task<bool> DeleteRoomAsync(Guid roomId);
    }
}
