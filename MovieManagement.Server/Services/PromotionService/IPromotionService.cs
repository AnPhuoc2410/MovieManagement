using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.PromotionService
{
    public interface IPromotionService
    {
        Task<PromotionDto> CreatePromotion(PromotionDto promotionDto);
        Task<PromotionDto> GetPromotion(Guid id);
        Task<IEnumerable<PromotionDto>> GetAllPromotions();
        Task<PromotionDto> UpdatePromotion(Guid id, PromotionDto promotionDto);
        Task<bool> DeletePromotion(Guid id);
    }
}
