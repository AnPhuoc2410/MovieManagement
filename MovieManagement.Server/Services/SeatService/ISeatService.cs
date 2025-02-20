using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public interface ISeatService
    {
        public Task<IEnumerable<Seat>> GetAllSeatsAsync();
        public Task<Seat> GetSeatByIdAsync(Guid seatId);
        public Task<Seat> CreateSeatAsync(SeatDto seatDto);
        public Task<Seat> UpdateSeatAsync(Guid seatId, SeatDto seatDto);
        public Task<bool> DeleteSeatAsync(Guid seatId);
    }
}
