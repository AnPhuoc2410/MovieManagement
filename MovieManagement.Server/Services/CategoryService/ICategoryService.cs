using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.CategoryService
{
    public interface ICategoryService
    {
        public Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        public Task<IEnumerable<CategoryDto>> GetCategoryPageAsync(int page, int pageSize);
        public Task<CategoryDto> GetCategoryByComposeIdAsync(Guid categoryId, Guid movieId);
        public Task<CategoryDto> CreateCategoryAsync(CategoryDto categoryDto);
        public Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, Guid movieId, CategoryDto categoryDto);
        public Task<bool> DeleteCategoryComposeAsync(Guid categoryId, Guid movieId);
    }
}
