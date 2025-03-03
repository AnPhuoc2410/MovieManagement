using AutoMapper;
using MovieManagement.Server.Data;
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

        public async Task<PromotionDto> CreateAsync(PromotionDto promotionDto)
        {
            //var newPromotion = new Promotion
            //{
            //    PromotionName = promotionDto.PromotionName,
            //    Image = promotionDto.Image,
            //    FromDate = promotionDto.FromDate,
            //    ToDate = promotionDto.ToDate,
            //    Discount = promotionDto.Discount,
            //    Content = promotionDto.Content
            //};

            var newPromotion = _mapper.Map<Promotion>(promotionDto);
            newPromotion.PromotionId = Guid.NewGuid();

            // CreateAsync the promotion and return the created entity
            var createdPromotion = await _unitOfWork.PromotionRepository.CreateAsync(newPromotion);
            return _mapper.Map<PromotionDto>(createdPromotion);
        }

        public async Task<PromotionDto> GetByIdAsync(Guid id)
        {
            var promotion = await _unitOfWork.PromotionRepository.GetByIdAsync(id);
            if (promotion == null)
            {
                // You might choose to throw a custom exception or return null
                throw new Exception("Promotion not found.");
            }
            return _mapper.Map<PromotionDto>(promotion);
        }

        public async Task<IEnumerable<PromotionDto>> GetAllAsync()
        {
            var promotions = await _unitOfWork.PromotionRepository.GetAllAsync();
            return _mapper.Map<List<PromotionDto>>(promotions);
        }

        public async Task<PromotionDto> UpdateAsync(Guid id, PromotionDto promotionDto)
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

        public async Task<bool> DeleteAsync(Guid id)
        {
            // Delete the promotion using the repository
            var result = await _unitOfWork.PromotionRepository.DeleteAsync(id);
            return result;
        }

        public async Task<IEnumerable<PromotionDto>> GetPageAsync(int page, int pageSize)
        {
            var promotions = await _unitOfWork.PromotionRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<PromotionDto>>(promotions);
        }
    }
}
