using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.PromotionService
{
    public class PromotionService : IPromotionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PromotionService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Promotion> CreatePromotion(PromotionDto promotion)
        {
            var newPromotion = new Promotion
            {
                PromotionName = promotion.PromotionName,
                Image = promotion.Image,
                FromDate = promotion.FromDate,
                ToDate = promotion.ToDate,
                Discount = promotion.Discount,
                Content = promotion.Content
            };

            // Create the promotion and return the created entity
            var createdPromotion = await _unitOfWork.PromotionRepository.CreateAsync(newPromotion);
            return createdPromotion;
        }

        public async Task<Promotion> GetPromotion(Guid id)
        {
            var promotion = await _unitOfWork.PromotionRepository.GetByIdAsync(id);
            if (promotion == null)
            {
                // You might choose to throw a custom exception or return null
                throw new Exception("Promotion not found.");
            }
            return promotion;
        }

        public async Task<IEnumerable<Promotion>> GetAllPromotions()
        {
            var promotions = await _unitOfWork.PromotionRepository.GetAllAsync();
            return promotions;
        }

        public async Task<Promotion> UpdatePromotion(Guid id, PromotionDto promotion)
        {
            // Retrieve the existing promotion
            var existingPromotion = await _unitOfWork.PromotionRepository.GetByIdAsync(id);
            if (existingPromotion == null)
            {
                throw new Exception("Promotion not found.");
            }

            // Update the fields
            existingPromotion.PromotionName = promotion.PromotionName;
            existingPromotion.Image = promotion.Image;
            existingPromotion.FromDate = promotion.FromDate;
            existingPromotion.ToDate = promotion.ToDate;
            existingPromotion.Discount = promotion.Discount;
            existingPromotion.Content = promotion.Content;

            // Update the promotion in the repository and return the updated entity
            var updatedPromotion = await _unitOfWork.PromotionRepository.UpdateAsync(existingPromotion);
            return updatedPromotion;
        }

        public async Task<bool> DeletePromotion(Guid id)
        {
            // Delete the promotion using the repository
            var result = await _unitOfWork.PromotionRepository.DeleteAsync(id);
            return result;
        }
    }
}
