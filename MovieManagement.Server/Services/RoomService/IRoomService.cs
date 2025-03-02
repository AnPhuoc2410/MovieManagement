using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public interface IRoomService
    {

        Task<IEnumerable<RoomDto>> GetAllAsync();
        Task<IEnumerable<RoomDto>> GetPageAsync(int page, int pageSize);    
        Task<RoomDto> GetIdAsync(Guid roomId);
        Task<RoomDto> CreateAsync(RoomDto room);
        Task<RoomDto> UpdateAsync(Guid roomId, RoomDto room);
        Task<bool> DeleteAsync(Guid roomId);

    }
}
