using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public interface ISeatService
    {

        public Task<IEnumerable<SeatDto>> GetAllAsync();
        public Task<IEnumerable<SeatDto>> GetPageAsync(int page, int pageSize);
        public Task<SeatDto> GetByIdAsync(Guid seatId);
        public Task<SeatDto> CreateAsync(SeatDto seat);
        public Task<SeatDto> UpdateAsync(Guid seatId, SeatDto seat);
        public Task<bool> DeleteAsync(Guid seatId);

        public Task CreateByRoomAsync(Guid SeatTypeId, Guid roomId);

    }
}
