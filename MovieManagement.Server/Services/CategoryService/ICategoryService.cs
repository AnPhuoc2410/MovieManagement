using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.CategoryService
{
    public interface ICategoryService
    {
        public Task<IEnumerable<CategoryDto>> GetAllAsync();
        public Task<IEnumerable<CategoryDto>> GetPageAsync(int page, int pageSize);
        public Task<CategoryDto> GetByComposeIdAsync(Guid categoryId, Guid movieId);
        public Task<CategoryDto> CreateAsync(CategoryDto categoryDto);
        public Task<CategoryDto> UpdateAsync(Guid categoryId, Guid movieId, CategoryDto categoryDto);
        public Task<bool> DeleteComposeAsync(Guid categoryId, Guid movieId);
    }
}
