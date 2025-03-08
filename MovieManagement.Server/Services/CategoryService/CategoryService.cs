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


        public async Task<CategoryDto> GetByIdAsync(Guid categoryId)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
            return _mapper.Map<CategoryDto>(category);
        }


        public async Task<CategoryDto> CreateAsync(CategoryDto categoryDto)
        {
            categoryDto.CategoryId = null;   
            var createdCategory = await _unitOfWork.CategoryRepository.CreateAsync(_mapper.Map<Category>(categoryDto));
            return _mapper.Map<CategoryDto>(createdCategory);
        }


        public async Task<CategoryDto> UpdateAsync(Guid categoryId, CategoryDto categoryDto)
        {
            var existingCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);

            existingCategory.Name = categoryDto.Name;

            var updatedCategory = await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory);
            return _mapper.Map<CategoryDto>(updatedCategory);
        }


        public async Task<bool> DeleteAsync(Guid categoryId)
        {
            return await _unitOfWork.CategoryRepository.DeleteAsync(categoryId);
        }

        
    }
}
