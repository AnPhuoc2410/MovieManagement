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
        public async Task<IEnumerable<RoomDto>> GetRoomPageAsync(int page, int pageSize)
        {
            var rooms = await _unitOfWork.RoomRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<RoomDto>>(rooms);
        }
        public async Task<RoomDto> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            return _mapper.Map<RoomDto>(room);
        }
        public async Task<RoomDto> CreateRoomAsync(RoomDto roomDto)
        {
            var newRoom = _mapper.Map<Room>(roomDto);
            var createdRoom = await _unitOfWork.RoomRepository.CreateAsync(newRoom);
            return _mapper.Map<RoomDto>(createdRoom);
        }
        public async Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto roomDto)
        {
            var existingRoom = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            existingRoom.RoomName = roomDto.RoomName;
            existingRoom.Column = roomDto.Column;
            existingRoom.Row = roomDto.Row;
            existingRoom.Total = roomDto.Total;
            var updatedRoom = await _unitOfWork.RoomRepository.UpdateAsync(existingRoom);
            return _mapper.Map<RoomDto>(updatedRoom);

        }
        public Task<bool> DeleteRoomAsync(Guid roomId)
        {
            return _unitOfWork.RoomRepository.DeleteAsync(roomId);
        }
    }
}
