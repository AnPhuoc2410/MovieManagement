﻿using AutoMapper;
using MovieManagement.Server.Data;
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
        public async Task<IEnumerable<RoomDto>> GetAllAsync()
        {
            var rooms = await _unitOfWork.RoomRepository.GetAllAsync();
            return _mapper.Map<List<RoomDto>>(rooms);
        }
        public async Task<IEnumerable<RoomDto>> GetPageAsync(int page, int pageSize)
        {
            var rooms = await _unitOfWork.RoomRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<RoomDto>>(rooms);
        }
        public async Task<RoomDto> GetIdAsync(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            return _mapper.Map<RoomDto>(room);
        }
        public async Task<RoomDto> CreateAsync(RoomDto roomDto)
        {
            var newRoom = new Room
            {
                Name = roomDto.Name,
                Column = roomDto.Column,
                Row = roomDto.Row,
                Total = roomDto.Row * roomDto.Column
            };
            var createdRoom = await _unitOfWork.RoomRepository.CreateAsync(newRoom);
            return _mapper.Map<RoomDto>(createdRoom);
        }
        public async Task<RoomDto> UpdateAsync(Guid roomId, RoomDto roomDto)
        {
            var updateRoom = await _unitOfWork.RoomRepository.GetByIdAsync(roomId);
            updateRoom.Name = roomDto.Name;
            updateRoom.Column = roomDto.Column;
            updateRoom.Row = roomDto.Row;
            updateRoom.Total = roomDto.Total;
            var room = await _unitOfWork.RoomRepository.UpdateAsync(updateRoom);
            return _mapper.Map<RoomDto>(room);

        }
        public async Task<bool> DeleteAsync(Guid roomId)
        {
            return await _unitOfWork.RoomRepository.DeleteAsync(roomId);
        }

        public async Task<RoomResponseModel> GetRoomInfo(Guid roomId)
        {
            var room = await _unitOfWork.RoomRepository.GetRoomInfo(roomId);

            var response = _mapper.Map<RoomResponseModel>(room);

            return response;

        }

    }
}
