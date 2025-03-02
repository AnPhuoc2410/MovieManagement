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
        public async Task<IEnumerable<CategoryDetailDto>> GetPageAsync(int page, int pageSize)
        {
            var categoryDetails = await _unitOfWork.CategoryDetailRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<CategoryDetailDto>>(categoryDetails);
        }
        public async Task<CategoryDetailDto> GetCategoryDetailByIdAsync(Guid movieId, Guid categoryId)
        {
            var categoryDetail = await _unitOfWork.CategoryDetailRepository.GetByComposeIdAsync(movieId, categoryId);
            return _mapper.Map<CategoryDetailDto>(categoryDetail);
        }
        public async Task<CategoryDetailDto> CreateCategoryDetailAsync(CategoryDetailDto categoryDetailDto)
        {
            var newCategory = new CategoryDetail
            {
                MovieId = categoryDetailDto.MovieId,
                CategoryId = categoryDetailDto.CategoryId,
            };
            var createdCategory = await _unitOfWork.CategoryDetailRepository.CreateAsync(newCategory);
            return _mapper.Map<CategoryDetailDto>(createdCategory);
        }
        public async Task<CategoryDetailDto> UpdateCategoryDetailAsync(Guid categoryId, Guid movieId)
        {
            var existingCategoryDetail = await _unitOfWork.CategoryDetailRepository.GetByComposeIdAsync(movieId, categoryId);
            existingCategoryDetail.MovieId = movieId;
            existingCategoryDetail.CategoryId = categoryId;
            var updatedCategory = await _unitOfWork.CategoryDetailRepository.UpdateAsync(existingCategoryDetail);
            return _mapper.Map<CategoryDetailDto>(updatedCategory);
        }
        public Task<bool> DeleteCategoryDetailAsync(Guid categoryId, Guid movieId)
        {
            return _unitOfWork.CategoryDetailRepository.DeleteComposeAsync(movieId, categoryId);
        }
    }
}
