using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.CategoryDetailService
{
    public interface ICategoryDetailService
    {
        public Task<IEnumerable<CategoryDetailDto>> GetAllCategoryDetailsAsync();
        public Task<IEnumerable<CategoryDetailDto>> GetCategoryDetailPageAsync(int page, int pageSize);
        public Task<CategoryDetailDto> GetCategoryByIdAsync(Guid categoryId);
        public Task<CategoryDetailDto> CreateCategoryAsync(CategoryDetailDto categoryDetailDto);
        public Task<CategoryDetailDto> UpdateCategoryAsync(Guid categoryId, CategoryDetailDto categoryDetailDto);
        public Task<bool> DeleteCategoryAsync(Guid categoryId);
    }
}
