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
                if (seats.Count == 0)
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
                if (seats.Count == 0)
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
                var updatedSeat = await _unitOfWork.SeatRepository.UpdateAsync(_mapper.Map<Seat>(seatDto));
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

        public async Task CreateByRoomAsync(Guid SeatTypeId, RoomDto roomDto)
        {

            for (int i = 0; i < roomDto.Row; i++)
            {
                for (int j = 0; j < roomDto.Column; j++)
                {
                    _unitOfWork.SeatRepository.Create(new Seat
                    {
                        AtRow = NumberToLetter(i).ToString(),
                        AtColumn = j + 1,
                        RoomId = roomDto.RoomId.Value,
                        SeatTypeId = SeatTypeId,
                        IsActive = true
                    });
                }
            }
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
