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


        public async Task<IEnumerable<CategoryDetailDto>> GetAllAsync()
        {
            var categoryDetails = await _unitOfWork.CategoryDetailRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDetailDto>>(categoryDetails);
        }


        public async Task<IEnumerable<CategoryDetailDto>> GetPageAsync(int page, int pageSize)
        {
            var categoryDetails = await _unitOfWork.CategoryDetailRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<CategoryDetailDto>>(categoryDetails);
        }


        public async Task<CategoryDetailDto> GetByIdAsync(Guid categoryId)
        {
            var categoryDetail = await _unitOfWork.CategoryDetailRepository.GetByIdAsync(categoryId);
            return _mapper.Map<CategoryDetailDto>(categoryDetail);
        }


        public async Task<CategoryDetailDto> CreateAsync(CategoryDetailDto categoryDetailDto)
        {
            var newCategory = new CategoryDetail
            {
                Name = categoryDetailDto.Name,
                Description = categoryDetailDto.Description
            };
            var createdCategory = await _unitOfWork.CategoryDetailRepository.CreateAsync(newCategory);
            return _mapper.Map<CategoryDetailDto>(createdCategory);
        }


        public async Task<CategoryDetailDto> UpdateAsync(Guid categoryId, CategoryDetailDto categoryDetailDto)
        {
            var existingCategoryDetail = await _unitOfWork.CategoryDetailRepository.GetByIdAsync(categoryId);

            existingCategoryDetail.Description = categoryDetailDto.Description;
            existingCategoryDetail.Name = categoryDetailDto.Name;

            var updatedCategory = await _unitOfWork.CategoryDetailRepository.UpdateAsync(existingCategoryDetail);
            return _mapper.Map<CategoryDetailDto>(updatedCategory);
        }


        public async Task<bool> DeleteAsync(Guid categoryId)
        {
            return await _unitOfWork.CategoryDetailRepository.DeleteAsync(categoryId);
        }


    }
}
