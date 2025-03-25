using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

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
            if (rooms == null || !rooms.Any())
                throw new NotFoundException("Rooms not found!");

            return _mapper.Map<List<RoomDto>>(rooms);
        }

        public async Task<IEnumerable<RoomDto>> GetRoomPageAsync(int page, int pageSize)
        {
            var rooms = await _unitOfWork.RoomRepository.GetPageAsync(page, pageSize);
            if (rooms == null)
                throw new NotFoundException("Rooms not found!");

            return _mapper.Map<IEnumerable<RoomDto>>(rooms);
        }

        public async Task<RoomDto> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            if (room == null)
                throw new NotFoundException("Room not found!");

            return _mapper.Map<RoomDto>(room);
        }

        public async Task<RoomDto> CreateRoomAsync(RoomDto roomDto, Guid movieTheaterId)
        {
            if (roomDto.Row <= 0 || roomDto.Column <= 0)
                throw new Exception("Invalid row or column number.");
            var movieTheater = await _unitOfWork.MovieTheaterRepository.GetByIdAsync(movieTheaterId)
                ?? throw new NotFoundException("Movie theater not found!");

            var newRoom = _mapper.Map<Room>(roomDto);
            newRoom.RoomId = Guid.NewGuid();
            newRoom.Total = newRoom.Row * newRoom.Column;
            newRoom.MovieTheaterId = movieTheaterId;
            var createdRoom = await _unitOfWork.RoomRepository.CreateAsync(newRoom);
            if (createdRoom == null)
                throw new Exception("Failed to create room.");

            return _mapper.Map<RoomDto>(createdRoom);
        }

        public async Task<RoomDto> UpdateRoomAsync(Guid roomId, RoomDto roomDto)
        {
            var existingRoom = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            if (existingRoom == null)
                throw new NotFoundException("Room not found!");

            roomDto.Total = roomDto.Row * roomDto.Column;
            roomDto.RoomId = roomId;
            _mapper.Map(roomDto, existingRoom);

            var updatedRoom = await _unitOfWork.RoomRepository.UpdateAsync(existingRoom);
            if (updatedRoom == null)
                throw new DbUpdateException("Fail to create room.");
            return _mapper.Map<RoomDto>(updatedRoom);
        }

        public async Task<bool> DeleteRoomAsync(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            if (room == null)
                throw new NotFoundException("Room not found!");
            return await _unitOfWork.RoomRepository.DeleteAsync(roomId);
        }

        public async Task<RoomResponseModel> GetRoomInfo(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetRoomInfo(roomId);
            if (room == null)
                throw new NotFoundException("Room not found!");

            var response = _mapper.Map<RoomResponseModel>(room);

            return response;

        }

    }
}
