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


        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }


        public async Task<IEnumerable<CategoryDto>> GetPageAsync(int page, int pageSize)
        {
            var categories = await _unitOfWork.CategoryRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<CategoryDto>>(categories);
        }


        public async Task<CategoryDto> GetByComposeIdAsync(Guid categoryId, Guid movieId)
        {
            var category = await _unitOfWork.CategoryRepository.GetByComposeIdAsync(categoryId, movieId);
            return _mapper.Map<CategoryDto>(category);
        }


        public async Task<CategoryDto> CreateAsync(CategoryDto categoryDto)
        {
            var newCategory = new Category
            {
                CategoryId = categoryDto.CategoryId,
                MovieId = categoryDto.MovieId
            };
            var createdCategory = await _unitOfWork.CategoryRepository.CreateAsync(newCategory);
            return _mapper.Map<CategoryDto>(createdCategory);
        }


        public async Task<CategoryDto> UpdateAsync(Guid categoryId, Guid movieId, CategoryDto categoryDto)
        {
            var existingCategory = await _unitOfWork.CategoryRepository.GetByComposeIdAsync(categoryId, movieId);

            existingCategory.MovieId = categoryDto.MovieId;
            existingCategory.CategoryId = categoryDto.CategoryId;

            var updatedCategory = await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory);
            return _mapper.Map<CategoryDto>(updatedCategory);
        }


        public async Task<bool> DeleteComposeAsync(Guid categoryId, Guid movieId)
        {
            return await _unitOfWork.CategoryRepository.DeleteComposeAsync(categoryId, movieId);
        }


    }
}
