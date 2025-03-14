using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.RoomService
{
    public interface IRoomService
    {

        Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
        Task<IEnumerable<RoomDto>> GetRoomPageAsync(int page, int pageSize);    
        Task<RoomDto> GetRoomByIdAsync(Guid roomId);
        Task<RoomDto> CreateRoomAsync(RoomDto room);
        Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto room);
        Task<bool> DeleteRoomAsync(Guid roomId);

        Task<RoomResponseModel> GetRoomInfo(Guid roomId);

    }
}
