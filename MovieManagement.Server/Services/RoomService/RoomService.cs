using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
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
            try
            {
                var rooms = await _unitOfWork.RoomRepository.GetAllAsync();
                if (rooms == null || !rooms.Any())
                    throw new NotFoundException("Rooms not found!");

                return _mapper.Map<List<RoomDto>>(rooms);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access database due to system error.", ex);
            }
        }

        public async Task<IEnumerable<RoomDto>> GetRoomPageAsync(int page, int pageSize)
        {
            try
            {
                var rooms = await _unitOfWork.RoomRepository.GetPageAsync(page, pageSize);
                if (rooms == null || !rooms.Any())
                    throw new NotFoundException("Rooms not found!");

                return _mapper.Map<IEnumerable<RoomDto>>(rooms);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access database due to system error.", ex);
            }
        }

        public async Task<RoomDto> GetRoomByIdAsync(Guid roomId)
        {
            try
            {
                var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
                if (room == null)
                    throw new NotFoundException("Room not found!");

                return _mapper.Map<RoomDto>(room);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access database due to system error.", ex);
            }
        }

        public async Task<RoomDto> CreateRoomAsync(RoomDto roomDto)
        {
            try
            {
                var newRoom = _mapper.Map<Room>(roomDto);
                newRoom.RoomId = Guid.NewGuid();

                var createdRoom = await _unitOfWork.RoomRepository.CreateAsync(newRoom);
                if (createdRoom == null)
                    throw new Exception("Failed to create room.");

                return _mapper.Map<RoomDto>(createdRoom);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into Database", ex);
            }
        }

        public async Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto roomDto)
        {
            try
            {
                var existingRoom = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
                if (existingRoom == null)
                    throw new NotFoundException("Room not found!");
                var updatedRoom = await _unitOfWork.RoomRepository.UpdateAsync(_mapper.Map<Room>(roomDto));
                if (updatedRoom == null)
                    throw new DbUpdateException("Fail to create room.");
                return _mapper.Map<RoomDto>(updatedRoom);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access database due to system error.", ex);
            }
        }

        public async Task<bool> DeleteRoomAsync(Guid roomId)
        {
            try
            {
                var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
                if (room == null)
                    throw new NotFoundException("Room not found!");
                return await _unitOfWork.RoomRepository.DeleteAsync(roomId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access database due to system error.", ex);
            }
        }
    }
}
