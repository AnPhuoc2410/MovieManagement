using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.PromotionService
{
    public interface IPromotionService
    {
        Task<PromotionDto> CreatePromotionAsync(PromotionDto promotion);
        Task<IEnumerable<PromotionDto>> GetPromotionPageAsync(int page, int pageSize);
        Task<PromotionDto> GetPromotionByIdAsync(Guid id);
        Task<IEnumerable<PromotionDto>> GetAllPromotionsAsync();
        Task<PromotionDto> UpdatePromotionAsync(Guid id, PromotionDto promotion);
        Task<bool> DeletePromotionAsync(Guid id);
    }
}
