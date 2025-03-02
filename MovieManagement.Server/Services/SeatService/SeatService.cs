using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public class SeatService : ISeatService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SeatService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<SeatDto>> GetAllSeatsAsync()
        {
            var seats = await _unitOfWork.SeatRepository.GetAllAsync();
            return _mapper.Map<List<SeatDto>>(seats);
        }

        public async Task<SeatDto> GetSeatByIdAsync(Guid seatId)
        {
            var seat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
            return _mapper.Map<SeatDto>(seat);
        }

        public async Task<SeatDto> CreateSeatAsync(SeatDto seat)
        {
            var newSeat = new Seat
            {
                AtRow = seat.AtRow,
                AtColumn = seat.AtColumn,
                RoomId = seat.RoomId,
                SeatTypeId = seat.SeatTypeId,
                IsAtive = true
            };
            var createdSeat = await _unitOfWork.SeatRepository.CreateAsync(newSeat);
            return _mapper.Map<SeatDto>(createdSeat);
        }

        public async Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seat)
        {
            var newSeat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);

            newSeat.AtRow = seat.AtRow;
            newSeat.AtColumn = seat.AtColumn;
            newSeat.RoomId = seat.RoomId;
            newSeat.SeatTypeId = seat.SeatTypeId;
            newSeat.IsAtive = seat.IsAtive;

            var updatedSeat = await _unitOfWork.SeatRepository.UpdateAsync(newSeat);
            return _mapper.Map<SeatDto>(updatedSeat);
        }

        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            return await _unitOfWork.SeatRepository.DeleteAsync(seatId);
        }
    }
}
