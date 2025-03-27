using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
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
            if (categories == null)
            {
                throw new NotFoundException("Categories not found!");
            }
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoryPageAsync(int page, int pageSize)
        {
            if (page < 0 || pageSize < 1)
            {
                throw new BadRequestException("Page and PageSize is invalid");
            }
            var categories = await _unitOfWork.CategoryRepository.GetPageAsync(page, pageSize);
            if (categories == null) {
                throw new NotFoundException("Categories not found!");
            }
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> GetCategoryByComposeIdAsync(Guid categoryId, Guid movieId)
        {
            if (categoryId == Guid.Empty || movieId == Guid.Empty)
            {
                throw new BadRequestException("Category and Movie Id is invalid");
            }
            var category = _mapper.Map<CategoryDto>(await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId));
            if(category == null)
            {
                throw new NotFoundException("Category cannot found!");
            }
            return category;
        }

        public async Task<CategoryDto> CreateCategoryAsync(CategoryDto categoryDto)
        {
            categoryDto.CategoryId = null;
            var createdCategory = await _unitOfWork.CategoryRepository.CreateAsync(_mapper.Map<Category>(categoryDto));
            if (createdCategory == null)
            {
                throw new Exception("Failed to create bill.");
            }
            return _mapper.Map<CategoryDto>(createdCategory);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, Guid movieId, CategoryDto categoryDto)
        {
            if (categoryId == Guid.Empty || movieId == Guid.Empty)
            {
                throw new BadRequestException("Category and Movie Id is invalid");
            }
            var existingCategory = _mapper.Map<Category>(categoryDto);
            if (existingCategory == null)
            {
                throw new NotFoundException("Category cannot found!");
            }
            return _mapper.Map<CategoryDto>(await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory));
        }

        public async Task<bool> DeleteCategoryComposeAsync(Guid categoryId, Guid movieId)
        {
            if (categoryId == Guid.Empty || movieId == Guid.Empty)
            {
                throw new BadRequestException("Category and Movie Id is invalid");
            }
            if (await _unitOfWork.BillRepository.GetByIdAsync(categoryId) == null)
            {
                throw new NotFoundException("Category cannot found!");

            }
            return await _unitOfWork.CategoryRepository.DeleteAsync(categoryId);
        }
    }
}
