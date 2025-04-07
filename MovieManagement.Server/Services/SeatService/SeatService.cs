using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Extensions.SignalR;
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
            var seats = await _unitOfWork.SeatRepository.GetAllAsync();
            if(seats == null)
                throw new NotFoundException("Seats not found!");
            return _mapper.Map<List<SeatDto>>(seats);
        }

        public async Task<IEnumerable<SeatDto>> GetSeatPageAsync(int page, int pageSize)
        {
            if (page < 0 || pageSize < 1)
                throw new BadRequestException("Page and PageSize is invalid");
            var seats = await _unitOfWork.SeatRepository.GetPageAsync(page, pageSize);
            if(seats == null)
                throw new NotFoundException("Seats not found!");
            return _mapper.Map<List<SeatDto>>(seats);
        }

        public async Task<SeatDto> GetSeatByIdAsync(Guid seatId)
        {
            if(seatId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var seat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
            if (seat == null)
                throw new NotFoundException("Seat not found!");
            return _mapper.Map<SeatDto>(seat);
        }

        public async Task<SeatDto> CreateSeatAsync(SeatDto seat)
        {
            var newSeat = _mapper.Map<Seat>(seat);
            newSeat.SeatId = Guid.NewGuid();
            var createdSeat = await _unitOfWork.SeatRepository.CreateAsync(newSeat);
            if (createdSeat == null)
                throw new Exception("Failed to create seat.");
            return _mapper.Map<SeatDto>(createdSeat);
        }

        public async Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seatDto)
        {
            if(seatId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var existingSeat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
            if (existingSeat == null)
                throw new NotFoundException("Seat not found!");

            _mapper.Map(seatDto, existingSeat);

            var updatedSeat = await _unitOfWork.SeatRepository.UpdateAsync(existingSeat);
            if (updatedSeat == null)
                throw new DbUpdateException("Fail to update seat.");
            return _mapper.Map<SeatDto>(updatedSeat);
        }

        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            if(seatId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var seat = await _unitOfWork.SeatRepository.GetByIdAsync(seatId);
            if (seat == null)
                throw new NotFoundException("Seat not found!");

            return await _unitOfWork.SeatRepository.DeleteAsync(seatId);
        }

        public async Task<bool> CreateByRoomIdAsync(Guid roomId, Guid SeatTypeId)
        {
            if(roomId == Guid.Empty || SeatTypeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");

            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);

            if (room == null)
                throw new ArgumentException("Room not found", nameof(roomId));

            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(SeatTypeId);

            if (seatType == null)
                throw new ArgumentException("SeatType not found", nameof(SeatTypeId));

            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);

            if (seats.Any())
                throw new ArgumentException("Seats already created", nameof(roomId));

            if (room.Column % seatType.SeatSize != 0)
                throw new ArgumentException("Seat size must be divisible by Column. Please select another option.", nameof(seatType.SeatSize));

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
                    _unitOfWork.SeatRepository.PrepareCreate(newSeat);
                }
            }

            return await _unitOfWork.SeatRepository.SaveAsync() > 0;
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

        public async Task<IEnumerable<SeatDto>> UpdateByList(List<Guid> list, bool isActived)
        {
            List<Seat> output = new List<Seat>();
            foreach (var item in list)
            {
                var seat = await _unitOfWork.SeatRepository.GetByIdAsync(item);
                if (seat == null)
                {
                    throw new NotFoundException("Seat not found!");
                }
                seat.IsActive = isActived;
                output.Add(await _unitOfWork.SeatRepository.UpdateAsync(seat));
            }
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<List<SeatDto>>(output);
        }

        public async Task<IEnumerable<SeatDto>> UpdateTypeByList(List<Guid> list, Guid seatTypeId)
        {
            List<Seat> output = new List<Seat>();
            foreach (var item in list)
            {
                var seat = await _unitOfWork.SeatRepository.GetByIdAsync(item);
                if (seat == null)
                {
                    throw new NotFoundException("Seat not found!");
                }
                seat.SeatTypeId = seatTypeId;
                output.Add(await _unitOfWork.SeatRepository.UpdateAsync(seat));
            }
            var showTimes = await _unitOfWork.ShowtimeRepository.GetShowTimeByRoomIdAsync(output.First().RoomId);

            if (showTimes.Where(st => st.EndTime > DateTime.Now).Count() > 0)
                throw new BadRequestException("Cannot update seats type when showtime is available.");

            await _unitOfWork.CompleteAsync();
            return _mapper.Map<List<SeatDto>>(output);
        }

        public async Task<bool> AddRowByRoomId(Guid roomId, Guid seatTypeId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            if (room == null)
            {
                throw new ArgumentException("Room not found", nameof(roomId));
            }
            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(seatTypeId);
            if (seatType == null)
            {
                throw new ArgumentException("SeatType not found", nameof(seatTypeId));
            }
            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);
            if (!seats.Any())
            {
                throw new ArgumentException("Seats not created", nameof(roomId));
            }
            if (room.Column % seatType.SeatSize != 0)
                throw new ArgumentException("Seat size must be divisible by Column. Please adjust room's size.", nameof(seatType.SeatSize));
            for (int i = 0; i < room.Column; i++)
            {
                var newSeat = new Seat
                {
                    AtRow = NumberToLetter(room.Row).ToString(),
                    AtColumn = i + 1,
                    RoomId = roomId,
                    SeatTypeId = seatTypeId,
                    IsActive = true,
                    SeatId = Guid.NewGuid()
                };
                _unitOfWork.SeatRepository.PrepareCreate(newSeat);
            }
            room.Row += 1;
            room.Total = room.Row * room.Column;
            await _unitOfWork.RoomRepository.UpdateAsync(room);
            return await _unitOfWork.SeatRepository.SaveAsync() > 0;
        }

        public async Task<bool> AddColumnByRoomId(Guid roomId, Guid seatTypeId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            if (room == null)
            {
                throw new ArgumentException("Room not found", nameof(roomId));
            }
            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(seatTypeId);
            if (seatType == null)
            {
                throw new ArgumentException("SeatType not found", nameof(seatTypeId));
            }
            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);
            if (!seats.Any())
            {
                throw new ArgumentException("Seats not created", nameof(roomId));
            }


            for (int i = 0; i < room.Row; i++)
            {
                for (int j = 1; j <= seatType.SeatSize; j++)
                {
                    var newSeat = new Seat
                    {
                        AtRow = NumberToLetter(i).ToString(),
                        AtColumn = room.Column + j,
                        RoomId = roomId,
                        SeatTypeId = seatTypeId,
                        IsActive = true,
                        SeatId = Guid.NewGuid()
                    };
                    _unitOfWork.SeatRepository.PrepareCreate(newSeat);
                }
            }
            room.Column += seatType.SeatSize.Value;
            room.Total = room.Row * room.Column;

            _unitOfWork.RoomRepository.PrepareUpdate(room);
            return await _unitOfWork.CompleteAsync() > 0;
        }

        public async Task<bool> DeleteByRoomId(Guid roomId)
        {
            if(roomId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);
            if (!seats.Any())
            {
                throw new ArgumentException("Seats not found", nameof(roomId));
            }
            foreach (var seat in seats)
            {
                _unitOfWork.SeatRepository.PrepareRemove(seat);
            }
            return await _unitOfWork.SeatRepository.SaveAsync() > 0;
        }

        public async Task<IEnumerable<SeatDto>> GetByRoomId(Guid roomId)
        {
            if(roomId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);
            if (!seats.Any())
            {
                throw new ArgumentException("Seats not found", nameof(roomId));
            }
            seats.OrderBy(s => s.AtRow).ThenBy(s => s.AtColumn);
            return _mapper.Map<List<SeatDto>>(seats);
        }

    }
}
