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
            try
            {
                var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
                if (categories.Count == 0) throw new NotFoundException("Category does not found!");
                return _mapper.Map<List<CategoryDto>>(categories);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoryPageAsync(int page, int pageSize)
        {
            try
            {
                var categories = await _unitOfWork.CategoryRepository.GetPageAsync(page, pageSize);
                if (categories.Count == 0) throw new NotFoundException("Category does not found!");
                return _mapper.Map<List<CategoryDto>>(categories);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<CategoryDto> GetCategoryByComposeIdAsync(Guid categoryId, Guid movieId)
        {
            try
            {
                var category = _mapper.Map<CategoryDto>(await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId));
                if (category == null)
                {
                    throw new NotFoundException("Category does not found!");
                }
                return category;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<CategoryDto> CreateCategoryAsync(CategoryDto categoryDto)
        {
            try
            {
                categoryDto.CategoryId = null;
                var createdCategory = await _unitOfWork.CategoryRepository.CreateAsync(_mapper.Map<Category>(categoryDto));
                if (createdCategory == null) throw new DbUpdateException("Cannot create new category!");
                return _mapper.Map<CategoryDto>(createdCategory);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into Database", ex);
            }
        }

        public async Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, Guid movieId, CategoryDto categoryDto)
        {
            try
            {
                var existingCategory = _mapper.Map<Category>(categoryDto);
                if (existingCategory == null) throw new NotFoundException($"{categoryId} - Category is not exist!");
                return _mapper.Map<CategoryDto>(await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory));
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<bool> DeleteCategoryComposeAsync(Guid categoryId, Guid movieId)
        {
            try
            {
                if (await _unitOfWork.BillRepository.GetByIdAsync(categoryId) == null)
                {
                    throw new NotFoundException($"{categoryId} - Category is not exist!");
                };
                return await _unitOfWork.CategoryRepository.DeleteAsync(categoryId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }


    }
}
