using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.PromotionService
{
    public interface IPromotionService
    {
        Task<PromotionDto> CreateAsync(PromotionDto promotion);
        Task<IEnumerable<PromotionDto>> GetPageAsync(int page, int pageSize);
        Task<PromotionDto> GetByIdAsync(Guid id);
        Task<IEnumerable<PromotionDto>> GetAllAsync();
        Task<PromotionDto> UpdateAsync(Guid id, PromotionDto promotion);
        Task<bool> DeleteAsync(Guid id);
    }
}
