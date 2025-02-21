using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public interface ISeatService
    {
        public Task<IEnumerable<SeatDto>> GetAllSeatsAsync();
        public Task<SeatDto> GetSeatByIdAsync(Guid seatId);
        public Task<SeatDto> CreateSeatAsync(SeatDto seatDto);
        public Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seatDto);
        public Task<bool> DeleteSeatAsync(Guid seatId);
    }
}
