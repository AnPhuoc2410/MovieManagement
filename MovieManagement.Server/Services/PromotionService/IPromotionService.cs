using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.PromotionService
{
    public interface IPromotionService
    {
        Task<Promotion> CreatePromotion(PromotionDto promotion);
        Task<Promotion> GetPromotion(Guid id);
        Task<IEnumerable<Promotion>> GetAllPromotions();
        Task<Promotion> UpdatePromotion(Guid id, PromotionDto promotion);
        Task<bool> DeletePromotion(Guid id);
    }
}
