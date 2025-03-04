using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.CategoryService
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoryPageAsync(int page, int pageSize)
        {
            var categories = await _unitOfWork.CategoryRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> GetCategoryByComposeIdAsync(Guid categoryId, Guid movieId)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CategoryDto categoryDto)
        {
            var newCategory = _mapper.Map<Category>(categoryDto);
            var createdCategory = await _unitOfWork.CategoryRepository.CreateAsync(newCategory);
            return _mapper.Map<CategoryDto>(createdCategory);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, Guid movieId, CategoryDto categoryDto)
        {
            var existingCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);

            existingCategory.MovieId = categoryDto.MovieId;
            existingCategory.Name = categoryDto.Name;
            existingCategory.Description = categoryDto.Description;

            var updatedCategory = await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory);
            return _mapper.Map<CategoryDto>(updatedCategory);
        }

        public async Task<bool> DeleteCategoryComposeAsync(Guid categoryId, Guid movieId)
        {
            return await _unitOfWork.CategoryRepository.DeleteAsync(categoryId);
        }
    }
}
