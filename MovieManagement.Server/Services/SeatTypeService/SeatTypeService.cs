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

        public async Task<SeatTypeDto> CreateAsync(SeatTypeDto seatType)
        {
            var createdOne = await _unitOfWork.SeatTypeRepository.CreateAsync(_mapper.Map<SeatType>(seatType));
            return _mapper.Map<SeatTypeDto>(createdOne);
        }

        public async Task<bool> DeleteAsync(Guid SeatTypeId)
        {
            return await _unitOfWork.SeatTypeRepository.DeleteAsync(SeatTypeId);
        }

        public async Task<IEnumerable<SeatTypeDto>> GetAllAsync()
        {
            var list = await _unitOfWork.SeatTypeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SeatTypeDto>>(list);
        }

        public async Task<SeatTypeDto> GetByIdAsync(Guid SeatTypeId)
        {
            var seatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(SeatTypeId);
            return _mapper.Map<SeatTypeDto>(seatType);
        }

        public async Task<IEnumerable<SeatTypeDto>> GetPageAsync(int page, int pageSize)
        {
            var list = await _unitOfWork.SeatTypeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<SeatTypeDto>>(list);
        }

        public async Task<SeatTypeDto> UpdateAsync(Guid SeatTypeId, SeatTypeDto seatType)
        {
            var existingSeatType = await _unitOfWork.SeatTypeRepository.GetByIdAsync(SeatTypeId);
            if (existingSeatType == null)
            {
                throw new NotFoundException("SeatType not found");
            }
            existingSeatType.TypeName = seatType.TypeName;
            existingSeatType.Price = seatType.Price;
            existingSeatType.IsActive = seatType.IsActive;
            return _mapper.Map<SeatTypeDto>(await _unitOfWork.SeatTypeRepository.UpdateAsync(existingSeatType));
        }
    }
}
