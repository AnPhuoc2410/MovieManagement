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

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCategoriesAsync()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            var categories = await _categoryService.GetCategoryPageAsync(page, pageSize);
            return Ok(categories);
        }


        [HttpGet("category/{categoryId:guid}/movie/{movieId:guid}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryByIdAsync(Guid categoryId, Guid movieId)
        {
            var category = await _categoryService.GetCategoryByComposeIdAsync(categoryId, movieId);
            return category;
        }


        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategoryAsync([FromBody] CategoryDto categoryDto)
        {
            var newCategory = await _categoryService.CreateCategoryAsync(categoryDto);
            return Ok(newCategory);
        }


        [HttpPut]
        [Route("category/{categoryId:guid}/movie/{movieId:guid}")]
        public async Task<ActionResult<CategoryDto>> UpdateCategoryAsync(Guid categoryId, Guid movieId, [FromBody] CategoryDto categoryDto)
        {
            var updatedCategory = await _categoryService.UpdateCategoryAsync(categoryId, movieId, categoryDto);
            return Ok(updatedCategory);
        }


        [HttpDelete]
        [Route("category/{categoryId:guid}/movie/{movieId:guid}")]
        public async Task<bool> DeleteCategoryAsync(Guid categoryId, Guid movieId)
        {
            var deleteCategory = await _categoryService.DeleteCategoryComposeAsync(categoryId, movieId);
            return deleteCategory;
        }


    }
}
