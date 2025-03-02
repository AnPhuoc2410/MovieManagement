using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.CategoryDetailService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryDetailController : Controller
    {
        private readonly ICategoryDetailService _categoryDetailService;
        public CategoryDetailController(ICategoryDetailService categoryDetailService)
        {
            _categoryDetailService = categoryDetailService;
        }
        [HttpGet("all")]
        public async Task<ActionResult> GetAllCategoryDetail()
        {
            var categoryDetails = await _categoryDetailService.GetAllCategoryDetailsAsync();
            return Ok(categoryDetails);
        }
        [HttpGet("{movieId:guid}/{categoryId:guid}")]
        public async Task<ActionResult<CategoryDetailDto>> GetCategoryDetail(Guid movieId, Guid categoryId)
        {
            var categoryDetail = await _categoryDetailService.GetCategoryDetailByIdAsync(movieId, categoryId);
            return Ok(categoryDetail);
        }
        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            var categorieDetails = await _categoryDetailService.GetPageAsync(page, pageSize);
            return Ok(categorieDetails);
        }
        [HttpPost]
        public async Task<ActionResult<CategoryDetailDto>> CreateCategoryDetail(CategoryDetailDto categoryDetail)
        {
            var newCategoryDetail = await _categoryDetailService.CreateCategoryDetailAsync(categoryDetail);
            return Ok(newCategoryDetail);
        }
        [HttpPut]
        public async Task<ActionResult<CategoryDetailDto>> UpdateCategoryDetail(Guid categoryId, Guid movieId)
        {
            var updatedCategoryDetail = await _categoryDetailService.UpdateCategoryDetailAsync(categoryId, movieId);
            return Ok(updatedCategoryDetail);
        }
        [HttpDelete]
        public async Task<bool> DeleteCategoryDetail(Guid movieId, Guid categoryId)
        {
            var deleted = await _categoryDetailService.DeleteCategoryDetailAsync(movieId, categoryId);
            return deleted;
        }
    }
}
