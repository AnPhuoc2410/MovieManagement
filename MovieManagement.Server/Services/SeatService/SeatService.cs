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
        public async Task<IEnumerable<SeatDto>> GetAllAsync()
        {
            var seats = await _unitOfWork.SeatRepository.GetAllAsync();
            return _mapper.Map<List<SeatDto>>(seats);
        }
        public async Task<IEnumerable<SeatDto>> GetPageAsync(int page, int pageSize)
        {
            var seats = await _unitOfWork.SeatRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<SeatDto>>(seats);
        }
        public async Task<SeatDto> GetByIdAsync(Guid seatId)
        {
            var seat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
            return _mapper.Map<SeatDto>(seat);
        }

        public async Task<SeatDto> CreateAsync(SeatDto seat)
        {
            var newSeat = new Seat
            {
                AtRow = seat.AtRow,
                AtColumn = seat.AtColumn,
                RoomId = seat.RoomId,
                SeatTypeId = seat.SeatTypeId,
                IsActive = true
            };
            var createdSeat = await _unitOfWork.SeatRepository.CreateAsync(newSeat);
            return _mapper.Map<SeatDto>(createdSeat);
        }

        public async Task<SeatDto> UpdateAsync(Guid seatId, SeatDto seat)
        {
            var newSeat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);

            newSeat.AtRow = seat.AtRow;
            newSeat.AtColumn = seat.AtColumn;
            newSeat.RoomId = seat.RoomId;
            newSeat.SeatTypeId = seat.SeatTypeId;
            newSeat.IsActive = seat.IsActive;

            var updatedSeat = await _unitOfWork.SeatRepository.UpdateAsync(newSeat);
            return _mapper.Map<SeatDto>(updatedSeat);
        }

        public async Task<bool> DeleteAsync(Guid seatId)
        {
            return await _unitOfWork.SeatRepository.DeleteAsync(seatId);
        }

        public async Task CreateByRoomAsync(Guid SeatTypeId, Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            if (room == null)
            {
                throw new ArgumentException("Room not found", nameof(roomId));
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
                        IsActive = true
                    };
                    await _unitOfWork.SeatRepository.CreateAsync(newSeat);
                }
            }

            await _unitOfWork.CompleteAsync();
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
