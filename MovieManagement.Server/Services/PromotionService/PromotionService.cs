using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.PromotionService
{
    public class PromotionService : IPromotionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PromotionService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PromotionDto> CreatePromotionAsync(PromotionDto promotionDto)
        {
            var newPromotion = _mapper.Map<Promotion>(promotionDto);
            newPromotion.PromotionId = Guid.NewGuid();
            var createdPromotion = _mapper.Map<PromotionDto>(await _unitOfWork.PromotionRepository.CreateAsync(newPromotion));
            return createdPromotion;
        }

        public async Task<PromotionDto> GetPromotionByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new BadRequestException("Id cannot be empty!");
            }
            var bill = _mapper.Map<PromotionDto>(await _unitOfWork.PromotionRepository.GetByIdAsync(id));
            if (bill == null)
            {
                throw new NotFoundException("Bill does not found!");
            }
            return bill;
        }

        public async Task<IEnumerable<PromotionDto>> GetAllPromotionsAsync()
        {
            var promotion = _mapper.Map<List<PromotionDto>>(await _unitOfWork.PromotionRepository.GetAllAsync());
            if(promotion == null)
            {
                throw new NotFoundException("Promotion not found!");
            }
            return promotion;
        }

        public async Task<PromotionDto> UpdatePromotionAsync(Guid id, PromotionDto promotionDto)
        {
            // Retrieve the existing promotion
            var existingPromotion = await _unitOfWork.PromotionRepository.GetByIdAsync(id);
            if (existingPromotion == null)
            {
                throw new Exception("Promotion not found.");
            }

            existingPromotion = _mapper.Map(promotionDto, existingPromotion);

            // Update the promotion in the repository and return the updated entity
            var updatedPromotion = await _unitOfWork.PromotionRepository.UpdateAsync(existingPromotion);
            return _mapper.Map<PromotionDto>(updatedPromotion);
        }

        public async Task<bool> DeletePromotionAsync(Guid id)
        {
            if (await _unitOfWork.PromotionRepository.GetByIdAsync(id) == null)
                throw new NotFoundException("Category cannot found!");
            return await _unitOfWork.PromotionRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<PromotionDto>> GetPromotionPageAsync(int page, int pageSize)
        {
            if (page < 0 || pageSize < 1)
                throw new BadRequestException("Page and PageSize is invalid");
            var promotions = await _unitOfWork.PromotionRepository.GetPageAsync(page, pageSize);
            if (promotions == null)
                throw new NotFoundException("Promotion cannot found!");
            return _mapper.Map<IEnumerable<PromotionDto>>(promotions);
        }
    }
}
