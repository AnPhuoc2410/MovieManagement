using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.CategoryDetailService
{
    public interface ICategoryDetailService
    {
        public Task<IEnumerable<CategoryDetailDto>> GetAllCategoryDetailsAsync();
        public Task<IEnumerable<CategoryDetailDto>> GetPageAsync(int page, int pageSize);
        public Task<CategoryDetailDto> GetCategoryDetailByIdAsync(Guid movieId, Guid categoryId);
        public Task<CategoryDetailDto> CreateCategoryDetailAsync(CategoryDetailDto categoryDetailDto);
        public Task<CategoryDetailDto> UpdateCategoryDetailAsync(Guid categoryId, Guid movieId);
        public Task<bool> DeleteCategoryDetailAsync(Guid categoryId, Guid movieId);
    }
}
