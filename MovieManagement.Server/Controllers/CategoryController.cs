using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.CategoryService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;


        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }


        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAllAsync()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            var categories = await _categoryService.GetPageAsync(page, pageSize);
            return Ok(categories);
        }


        [HttpGet("/{categoryId:guid}")]
        public async Task<ActionResult<bool>> GetCategoryById(Guid categoryId)
        {
            var category = await _categoryService.DeleteAsync(categoryId);
            return category;
        }


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<CategoryDto>> CreateCategoryAsync([FromBody] CategoryDto categoryDto)
        {
            var newCategory = await _categoryService.CreateAsync(categoryDto);
            return Ok(newCategory);
        }


        [HttpPut]
        [Route("Update/{categoryId:guid}")]
        public async Task<ActionResult<CategoryDto>> UpdateCategoryAsync(Guid categoryId, [FromBody] CategoryDto categoryDto)
        {
            var updatedCategory = await _categoryService.UpdateAsync(categoryId, categoryDto);
            return Ok(updatedCategory);
        }


        [HttpDelete]
        [Route("Delete/{categoryId:guid}")]
        public async Task<bool> DeleteCategoryAsync(Guid categoryId)
        {
            var deleteCategory = await _categoryService.DeleteAsync(categoryId);
            return deleteCategory;
        }


    }
}
