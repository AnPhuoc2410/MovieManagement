using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.CategoryDetailService
{
    public class CategoryDetailService : ICategoryDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public CategoryDetailService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        public async Task<IEnumerable<CategoryDetailDto>> GetAllCategoryDetailsAsync()
        {
            var categoryDetails = await _unitOfWork.CategoryDetailRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDetailDto>>(categoryDetails);
        }


        public async Task<IEnumerable<CategoryDetailDto>> GetCategoryDetailPageAsync(int page, int pageSize)
        {
            var categoryDetails = await _unitOfWork.CategoryDetailRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<CategoryDetailDto>>(categoryDetails);
        }


        public async Task<CategoryDetailDto> GetCategoryByIdAsync(Guid categoryId)
        {
            var categoryDetail = await _unitOfWork.CategoryDetailRepository.GetByIdAsync(categoryId);
            return _mapper.Map<CategoryDetailDto>(categoryDetail);
        }


        public async Task<CategoryDetailDto> CreateCategoryAsync(CategoryDetailDto categoryDetailDto)
        {
            var newCategory = _mapper.Map<CategoryDetail>(categoryDetailDto);
            var createdCategory = await _unitOfWork.CategoryDetailRepository.CreateAsync(newCategory);
            return _mapper.Map<CategoryDetailDto>(createdCategory);
        }


        public async Task<CategoryDetailDto> UpdateCategoryAsync(Guid categoryId, CategoryDetailDto categoryDetailDto)
        {
            var existingCategoryDetail = await _unitOfWork.CategoryDetailRepository.GetByIdAsync(categoryId);

            existingCategoryDetail.Description = categoryDetailDto.Description;
            existingCategoryDetail.CategoryName = categoryDetailDto.CategoryName;

            var updatedCategory = await _unitOfWork.CategoryDetailRepository.UpdateAsync(existingCategoryDetail);
            return _mapper.Map<CategoryDetailDto>(updatedCategory);
        }


        public async Task<bool> DeleteCategoryAsync(Guid categoryId)
        {
            return await _unitOfWork.CategoryDetailRepository.DeleteAsync(categoryId);
        }


    }
}
