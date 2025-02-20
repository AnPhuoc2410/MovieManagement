using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.RoomService
{
    public class RoomService : IRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        public RoomService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await _unitOfWork.RoomRepository.GetAllAsync();
        }
        public async Task<Room> GetRoomByIdAsync(Guid roomId)
        {
            return await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
        }
        public async Task<Room> CreateRoomAsync(Room room)
        {
            return await _unitOfWork.RoomRepository.CreateAsync(room);
        }
        public async Task<Room> UpdateRoomAsync(Guid roomId, RoomDto roomDto)
        {
            var updateRoom = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            updateRoom.Name = roomDto.Name;
            updateRoom.Column = roomDto.Column;
            updateRoom.Row = roomDto.Row;
            updateRoom.Total = roomDto.Total;
            return await _unitOfWork.RoomRepository.UpdateAsync(updateRoom);

        }
        public Task<bool> DeleteRoomAsync(Guid roomId)
        {
            return _unitOfWork.RoomRepository.DeleteAsync(roomId);
        }
    }
}
