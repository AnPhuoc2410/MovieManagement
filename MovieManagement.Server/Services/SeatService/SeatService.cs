using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
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
        public async Task<IEnumerable<SeatDto>> GetAllSeatAsync()
        {
            try
            {
                var seats = await _unitOfWork.SeatRepository.GetAllAsync();
                if (seats == null)
                    throw new NotFoundException("Seats not found!");
                return _mapper.Map<List<SeatDto>>(seats);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<SeatDto>> GetSeatPageAsync(int page, int pageSize)
        {
            try
            {
                var seats = await _unitOfWork.SeatRepository.GetPageAsync(page, pageSize);
                if (seats == null)
                    throw new NotFoundException("Seats not found!");
                return _mapper.Map<List<SeatDto>>(seats);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<SeatDto> GetSeatByIdAsync(Guid seatId)
        {
            try
            {
                var seat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
                if (seat == null)
                    throw new NotFoundException("Seat not found!");
                return _mapper.Map<SeatDto>(seat);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<SeatDto> CreateSeatAsync(SeatDto seat)
        {
            try
            {
                var newSeat = _mapper.Map<Seat>(seat);
                newSeat.SeatId = Guid.NewGuid();
                var createdSeat = await _unitOfWork.SeatRepository.CreateAsync(newSeat);
                if (createdSeat == null)
                    throw new Exception("Failed to create seat.");
                return _mapper.Map<SeatDto>(createdSeat);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into the database.", ex);
            }
        }

        public async Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seatDto)
        {
            try
            {
                var existingSeat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
                if (existingSeat == null)
                    throw new NotFoundException("Seat not found!");

                _mapper.Map(seatDto, existingSeat);

                var updatedSeat = await _unitOfWork.SeatRepository.UpdateAsync(existingSeat);
                if (updatedSeat == null)
                    throw new DbUpdateException("Fail to update seat.");
                return _mapper.Map<SeatDto>(updatedSeat);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            try
            {
                var seat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
                if (seat == null)
                    throw new NotFoundException("Seat not found!");

                return await _unitOfWork.SeatRepository.DeleteAsync(seatId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<bool> CreateByRoomIdAsync(Guid roomId, Guid SeatTypeId)
        {
            bool isCompleted = false;
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);

            if (room == null)
            {
                throw new ArgumentException("Room not found", nameof(roomId));
            }

            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(SeatTypeId);
            if (seatType == null)
            {
                throw new ArgumentException("SeatType not found", nameof(SeatTypeId));
            }

            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);
            if (seats.Any())
            {
                throw new ArgumentException("Seats already created", nameof(roomId));
            }

            for (int i = 0; i < room.Row; i++)
            {
                for (int j = 0; j < room.Column; j++)
                {
                    var newSeat = new Seat
                    {
                        AtRow = NumberToLetter(i).ToString(),
                        AtColumn = j + 1,
                        RoomId = roomId,
                        SeatTypeId = SeatTypeId,
                        IsActive = true,
                        SeatId = Guid.NewGuid()
                    };
                    await _unitOfWork.SeatRepository.CreateAsync(newSeat);
                }
            }

            isCompleted = await _unitOfWork.CompleteAsync() == 0;
            return isCompleted;
        }

        public static int LetterToNumber(char letter)
        {
            letter = char.ToUpper(letter);
            if (letter < 'A' || letter > 'Z')
            {
                throw new ArgumentOutOfRangeException(nameof(letter), "The letter must be between A and Z.");
            }
            return letter - 'A';
        }

        public static char NumberToLetter(int number)
        {
            if (number < 0 || number > 25)
            {
                throw new ArgumentOutOfRangeException(nameof(number), "The number must be between 0 and 25.");
            }
            return (char)(number + 'A');
        }


    }
}
