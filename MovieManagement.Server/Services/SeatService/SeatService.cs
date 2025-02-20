using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public class SeatService : ISeatService
    {
        private readonly IUnitOfWork _unitOfWork;
        public SeatService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Seat>> GetAllSeatsAsync()
        {
            return await _unitOfWork.SeatRepository.GetAllAsync();
        }
        public async Task<Seat> GetSeatByIdAsync(Guid seatId)
        {
            return await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
        }
        public async Task<Seat> CreateSeatAsync(SeatDto seatDto)
        {
            var newSeat = new Seat
            {
                Level = seatDto.Level,
                Number = seatDto.Number,
                RoomId = seatDto.RoomId,
                Type = seatDto.Type,
            };
            return await _unitOfWork.SeatRepository.CreateAsync(newSeat);
        }
        public async Task<Seat> UpdateSeatAsync(Guid seatId, SeatDto seatDto)
        {
            var updateSeat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);

            updateSeat.Level = seatDto.Level;
            updateSeat.Number = seatDto.Number;
            updateSeat.RoomId = seatDto.RoomId;
            updateSeat.Type = seatDto.Type;

            return await _unitOfWork.SeatRepository.UpdateAsync(updateSeat);
        }
        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            return await _unitOfWork.SeatRepository.DeleteAsync(seatId);
        }
    }
}
