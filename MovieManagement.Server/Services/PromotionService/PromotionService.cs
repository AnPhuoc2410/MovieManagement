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
            return _mapper.Map<PromotionDto>(_unitOfWork.PromotionRepository.CreateAsync(newPromotion));

            // CreateAsync the promotion and return the created entity
        }

        public async Task<PromotionDto> GetPromotionByIdAsync(Guid id)
        {
            try
            {
                var bill = _mapper.Map<PromotionDto>(await _unitOfWork.PromotionRepository.GetByIdAsync(id));
                if (bill == null)
                {
                    throw new NotFoundException("Bill does not found!");
                }
                return bill;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }

        }

        public async Task<IEnumerable<PromotionDto>> GetAllPromotionsAsync()
        {
            try
            {

                var promotion = _mapper.Map<List<PromotionDto>>(await _unitOfWork.ShowtimeRepository.GetAllAsync());
                if (promotion == null)
                {
                    throw new NotFoundException("Promotion does not found!");
                }
                return promotion;
            }
            catch (NotFoundException ex)
            {
                throw new NotFoundException("Promotion does not found!");
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<PromotionDto> UpdatePromotionAsync(Guid id, PromotionDto promotionDto)
        {
            try
            {

                // Retrieve the existing promotion
                var existingPromotion = await _unitOfWork.PromotionRepository.GetByIdAsync(id);
                if (existingPromotion == null)
                {
                    throw new Exception("Promotion not found.");
                }
                // Update the promotion in the repository and return the updated entity
                var updatedPromotion = await _unitOfWork.PromotionRepository.UpdateAsync(_mapper.Map<Promotion>(promotionDto));
                if (updatedPromotion == null)
                    throw new DbUpdateException("Fail to create promotion.");
                return _mapper.Map<PromotionDto>(updatedPromotion);


            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing with database.", ex);
            }
        }

        public async Task<bool> DeletePromotionAsync(Guid id)
        {
            try
            // Delete the promotion using the repository
            {
                if (await _unitOfWork.PromotionRepository.GetByIdAsync(id) == null)
                    throw new NotFoundException("Category cannot found!");
                return await _unitOfWork.PromotionRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<PromotionDto>> GetPromotionPageAsync(int page, int pageSize)
        {
            try
            {
                var promotions = await _unitOfWork.PromotionRepository.GetPageAsync(page, pageSize);
                if (promotions == null)
                    throw new NotFoundException("Promotion cannot found!");
                return _mapper.Map<IEnumerable<PromotionDto>>(promotions);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
    }
}
