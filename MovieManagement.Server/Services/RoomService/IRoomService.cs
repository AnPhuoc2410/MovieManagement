using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
        Task<IEnumerable<RoomDto>> GetPageAsync(int page, int pageSize);    
        Task<RoomDto> GetRoomByIdAsync(Guid roomId);
        //renaming please
        Task<RoomDto> CreateRoomAsync(RoomDto room);
        Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto room);
        Task<bool> DeleteRoomAsync(Guid roomId);
    }
}
