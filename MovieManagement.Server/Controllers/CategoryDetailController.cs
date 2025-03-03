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


        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllCategoryDetailsAsync()
        {
            var categoryDetails = await _categoryDetailService.GetAllCategoryDetailsAsync();
            return Ok(categoryDetails);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            var categorieDetails = await _categoryDetailService.GetCategoryDetailPageAsync(page, pageSize);
            return Ok(categorieDetails);
        }


        [HttpGet("{categoryId:guid}")]
        public async Task<ActionResult<CategoryDetailDto>> GetCategoryDetailByIdAsync(Guid categoryId)
        {
            var categoryDetail = await _categoryDetailService.GetCategoryByIdAsync(categoryId);
            return Ok(categoryDetail);
        }


        [HttpPost]
        public async Task<ActionResult<CategoryDetailDto>> CreateCategoryDetailAsync([FromBody] CategoryDetailDto categoryDetail)
        {
            var newCategoryDetail = await _categoryDetailService.CreateCategoryAsync(categoryDetail);
            return Ok(newCategoryDetail);
        }


        [HttpPut]
        [Route("{categoryId:guid}")]
        public async Task<ActionResult<CategoryDetailDto>> UpdateCategoryDetailAsync(Guid categoryId, [FromBody] CategoryDetailDto categoryDetailDto)
        {
            var updatedCategoryDetail = await _categoryDetailService.UpdateCategoryAsync(categoryId, categoryDetailDto);
            return Ok(updatedCategoryDetail);
        }


        [HttpDelete]
        [Route("{categoryId:guid}")]
        public async Task<bool> DeleteCategoryDetailAsync(Guid categoryId)
        {
            var deleted = await _categoryDetailService.DeleteCategoryAsync(categoryId);
            return deleted;
        }



    }
}
