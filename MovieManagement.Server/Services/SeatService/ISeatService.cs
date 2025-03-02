using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public interface ISeatService
    {
        public Task<IEnumerable<SeatDto>> GetAllSeatsAsync();
        public Task<IEnumerable<SeatDto>> GetPageAsync(int page, int pageSize);
        public Task<SeatDto> GetSeatByIdAsync(Guid seatId);
        public Task<SeatDto> CreateSeatAsync(SeatDto seat);
        public Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seat);
        public Task<bool> DeleteSeatAsync(Guid seatId);
    }
}
