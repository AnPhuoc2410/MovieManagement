using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatTypeService
{
    public class SeatTypeService : ISeatTypeService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SeatTypeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<SeatTypeDto> CreateSeatTypeAsync(SeatTypeDto seatType)
        {
            var newSeatType = _mapper.Map<SeatType>(seatType);
            newSeatType.SeatTypeId = Guid.NewGuid();
            var createdSeatType = await _unitOfWork.SeatTypeRepository.CreateAsync(newSeatType);
            return _mapper.Map<SeatTypeDto>(createdSeatType);
        }

        public async Task<bool> DeleteSeatTypeAsync(Guid seatTypeId)
        {
            return await _unitOfWork.SeatTypeRepository.DeleteAsync(seatTypeId);
        }

        public async Task<IEnumerable<SeatTypeDto>> GetAllSeatTypesAsync()
        {
            var seatTypes = await _unitOfWork.SeatTypeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SeatTypeDto>>(seatTypes);
        }

        public async Task<SeatTypeDto> GetSeatTypeByIdAsync(Guid SeatTypeId)
        {
            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(SeatTypeId);
            return _mapper.Map<SeatTypeDto>(seatType);
        }

        public async Task<IEnumerable<SeatTypeDto>> GetSeatTypePageAsync(int page, int pageSize)
        {
            var seatTypes = await _unitOfWork.SeatTypeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<SeatTypeDto>>(seatTypes);
        }

        public async Task<SeatTypeDto> UpdateSeatTypeAsync(Guid SeatTypeId, SeatTypeDto seatType)
        {
            var existingSeatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(SeatTypeId);
            if (existingSeatType == null)
            {
                throw new NotFoundException("SeatType not found");
            }
            existingSeatType.TypeName = seatType.TypeName;
            existingSeatType.Price = seatType.Price;
            existingSeatType.IsActive = seatType.IsActive;
            var updatedSeatType = await _unitOfWork.SeatTypeRepository.UpdateAsync(existingSeatType);
            return _mapper.Map<SeatTypeDto>(updatedSeatType);
        }
    }
}
