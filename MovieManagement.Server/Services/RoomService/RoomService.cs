using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public class RoomService : IRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public RoomService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
        {
            var rooms = await _unitOfWork.RoomRepository.GetAllAsync();
            return _mapper.Map<List<RoomDto>>(rooms);
        }
        public async Task<RoomDto> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            return _mapper.Map<RoomDto>(room);
        }
        public async Task<RoomDto> CreateRoomAsync(RoomDto roomDto)
        {
            var newRoom = new Room
            {
                Name = roomDto.Name,
                Column = roomDto.Column,
                Row = roomDto.Row,
                Total = roomDto.Total,
            };
            var createdRoom = await _unitOfWork.RoomRepository.CreateAsync(newRoom);
            return _mapper.Map<RoomDto>(createdRoom);
        }
        public async Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto roomDto)
        {
            var updateRoom = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            updateRoom.Name = roomDto.Name;
            updateRoom.Column = roomDto.Column;
            updateRoom.Row = roomDto.Row;
            updateRoom.Total = roomDto.Total;
            var room = await _unitOfWork.RoomRepository.UpdateAsync(updateRoom);
            return _mapper.Map<RoomDto>(room);

        }
        public Task<bool> DeleteRoomAsync(Guid roomId)
        {
            return _unitOfWork.RoomRepository.DeleteAsync(roomId);
        }
    }
}
