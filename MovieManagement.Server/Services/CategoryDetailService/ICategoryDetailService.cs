using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.CategoryDetailService
{
    public interface ICategoryDetailService
    {
        public Task<IEnumerable<CategoryDetailDto>> GetAllAsync();
        public Task<IEnumerable<CategoryDetailDto>> GetPageAsync(int page, int pageSize);
        public Task<CategoryDetailDto> GetByIdAsync(Guid categoryId);
        public Task<CategoryDetailDto> CreateAsync(CategoryDetailDto categoryDetailDto);
        public Task<CategoryDetailDto> UpdateAsync(Guid categoryId, CategoryDetailDto categoryDetailDto);
        public Task<bool> DeleteAsync(Guid categoryId);
    }
}
