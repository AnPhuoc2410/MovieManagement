﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Resources;

namespace MovieManagement.Server.Services.SeatTypeService
{
    public class SeatTypeService : ISeatTypeService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer _localizerSeatTypeTranslate;

        public SeatTypeService(IUnitOfWork unitOfWork, IMapper mapper, IStringLocalizerFactory factory)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _localizerSeatTypeTranslate = factory.Create("SeatTypeResource", typeof(SeatTypeResource).Assembly.FullName);
        }

        public async Task<SeatTypeDto> CreateSeatTypeAsync(SeatTypeDto seatType)
        {
            var newSeatType = _mapper.Map<SeatType>(seatType);
            newSeatType.SeatTypeId = Guid.NewGuid();
            var createdSeatType = await _unitOfWork.SeatTypeRepository.CreateAsync(newSeatType);
            if (createdSeatType == null)
                throw new Exception("Failed to create seat type.");
            return _mapper.Map<SeatTypeDto>(createdSeatType);
        }

        public async Task<bool> DeleteSeatTypeAsync(Guid seatTypeId)
        {
            if(seatTypeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(seatTypeId);
            if (seatType == null)
                throw new NotFoundException("SeatType not found!");

            return await _unitOfWork.SeatTypeRepository.DeleteAsync(seatTypeId);
        }

        public async Task<IEnumerable<SeatTypeDto>> GetAllSeatTypesAsync()
        {
            var seatTypes = await _unitOfWork.SeatTypeRepository.GetAllAsync();
            if (seatTypes == null)
                throw new NotFoundException("SeatTypes not found!");

            foreach (var item in seatTypes)
            {
                item.TypeName = _localizerSeatTypeTranslate[item.TypeName];
            }

            return _mapper.Map<List<SeatTypeDto>>(seatTypes);
        }

        public async Task<SeatTypeDto> GetSeatTypeByIdAsync(Guid seatTypeId)
        {
            if(seatTypeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");

            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(seatTypeId);

            if (seatType == null)
                throw new NotFoundException("SeatType not found!");

            seatType.TypeName = _localizerSeatTypeTranslate[seatType.TypeName];

            return _mapper.Map<SeatTypeDto>(seatType);
        }

        public async Task<IEnumerable<SeatTypeDto>> GetSeatTypePageAsync(int page, int pageSize)
        {
            if(page < 0 || pageSize < 1)
                throw new BadRequestException("Page and PageSize is invalid");

            var seatTypes = await _unitOfWork.SeatTypeRepository.GetPageAsync(page, pageSize);

            if (seatTypes == null)
                throw new NotFoundException("SeatTypes not found!");

            foreach (var item in seatTypes)
            {
                item.TypeName = _localizerSeatTypeTranslate[item.TypeName];
            }

            return _mapper.Map<List<SeatTypeDto>>(seatTypes);
        }

        public async Task<SeatTypeDto> UpdateSeatTypeAsync(Guid seatTypeId, SeatTypeDto seatType)
        {
            if(seatTypeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var existingSeatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(seatTypeId);
            if (existingSeatType == null)
                throw new NotFoundException("SeatType not found!");

            existingSeatType.TypeName = seatType.TypeName;
            existingSeatType.Price = seatType.Price;
            existingSeatType.IsActive = seatType.IsActive.Value;

            var updatedSeatType = await _unitOfWork.SeatTypeRepository.UpdateAsync(existingSeatType);
            if (updatedSeatType == null)
                throw new DbUpdateException("Fail to update seat type.");

            return _mapper.Map<SeatTypeDto>(updatedSeatType);
        }

    }
}
