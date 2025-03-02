using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.CategoryService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatogoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        public CatogoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet("all")]
        public async Task<ActionResult> GetAllAsync()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }
        [HttpGet("{categoryId:guid}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryById(Guid categoryId)
        {
            var category = await _categoryService.GetCategoryByIdAsync(categoryId);
            return category;
        }
        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            var categories = await _categoryService.GetPageAsync(page, pageSize);
            return Ok(categories);
        }
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategoryAsync(CategoryDto categoryDto)
        {
            var newCategory = await _categoryService.CreateCategoryAsync(categoryDto);
            return Ok(newCategory);
        }
        [HttpPut]
        public async Task<ActionResult<CategoryDto>> UpdateCategoryAsync(Guid categoryId, CategoryDto categoryDto)
        {
            var updatedCategory = await _categoryService.UpdateCategoryAsync(categoryId, categoryDto);
            return Ok(updatedCategory);
        }
        [HttpDelete]
        public async Task<bool> DeleteCategoryAsync(Guid categoryId)
        {
            var deleteCategory = await _categoryService.DeleteCategoryAsync(categoryId);
            return deleteCategory;
        }
    }
}
