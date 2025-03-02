using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.CategoryService
{
    public interface ICategoryService
    {
        public Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        public Task<IEnumerable<CategoryDto>> GetPageAsync(int page, int pageSize);
        public Task<CategoryDto> GetCategoryByIdAsync(Guid categoryId);
        public Task<CategoryDto> CreateCategoryAsync(CategoryDto categoryDto);
        public Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, CategoryDto categoryDto);
        public Task<bool> DeleteCategoryAsync(Guid categoryId);
    }
}
