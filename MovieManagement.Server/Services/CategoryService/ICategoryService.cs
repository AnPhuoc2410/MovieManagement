using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.CategoryService
{
    public interface ICategoryService
    {
        public Task<IEnumerable<CategoryDto>> GetAllAsync();
        public Task<IEnumerable<CategoryDto>> GetPageAsync(int page, int pageSize);
        public Task<CategoryDto> GetByIdAsync(Guid categoryId);
        public Task<CategoryDto> CreateAsync(CategoryDto categoryDto);
        public Task<CategoryDto> UpdateAsync(Guid categoryId, CategoryDto categoryDto);
        public Task<bool> DeleteAsync(Guid categoryId);
    }
}
