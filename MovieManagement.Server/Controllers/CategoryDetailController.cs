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
        [Route("GetAll")]
        public async Task<ActionResult> GetAllCategoryDetail()
        {
            var categoryDetails = await _categoryDetailService.GetAllAsync();
            return Ok(categoryDetails);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            var categorieDetails = await _categoryDetailService.GetPageAsync(page, pageSize);
            return Ok(categorieDetails);
        }


        [HttpGet("GetById/{categoryId:guid}")]
        public async Task<ActionResult<CategoryDetailDto>> GetCategoryDetail(Guid categoryId)
        {
            var categoryDetail = await _categoryDetailService.GetByIdAsync(categoryId);
            return Ok(categoryDetail);
        }


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<CategoryDetailDto>> CreateCategoryDetail([FromBody] CategoryDetailDto categoryDetail)
        {
            var newCategoryDetail = await _categoryDetailService.CreateAsync(categoryDetail);
            return Ok(newCategoryDetail);
        }


        [HttpPut]
        [Route("Update/{categoryId:guid}")]
        public async Task<ActionResult<CategoryDetailDto>> UpdateCategoryDetail(Guid categoryId, [FromBody] CategoryDetailDto categoryDetailDto)
        {
            var updatedCategoryDetail = await _categoryDetailService.UpdateAsync(categoryId, categoryDetailDto);
            return Ok(updatedCategoryDetail);
        }


        [HttpDelete]
        [Route("Delete/{categoryId:guid}")]
        public async Task<bool> DeleteCategoryDetail(Guid categoryId)
        {
            var deleted = await _categoryDetailService.DeleteAsync(categoryId);
            return deleted;
        }



    }
}
