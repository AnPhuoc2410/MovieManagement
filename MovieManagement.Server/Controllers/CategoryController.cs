using Azure;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
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


        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            var response = new ApiResponse<IEnumerable<CategoryDto>>
            {
                StatusCode = 200,
                Message = "Get all categories are a success",
                IsSuccess = true,
                Data = categories
            };
            return Ok(response);
        }

        [HttpGet("page/{page:int}/size/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategoryPages(int page, int pageSize)
        {
            var categories = await _categoryService.GetCategoryPageAsync(page, pageSize);
            var response = new ApiResponse<IEnumerable<CategoryDto>>
            {
                StatusCode = 200,
                Message = "Get categories are a success",
                IsSuccess = true,
                Data = categories
            };
            return Ok(response);
        }

        [HttpGet("movie/{movieId:guid}/category/{categoryId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Category>> GetCategoryById(Guid categoryId, Guid movieId)
        {
            var categories = await _categoryService.GetCategoryByComposeIdAsync(categoryId, movieId);
            var response = new ApiResponse<CategoryDto>
            {
                StatusCode = 200,
                Message = "Get categories in movie is success",
                IsSuccess = true,
                Data = categories
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CategoryDto categoryDto)
        {
            var newCategory = await _categoryService.CreateCategoryAsync(categoryDto);
            var response = new ApiResponse<CategoryDto>
            {
                StatusCode = 200,
                Message = "Create category is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{categoryId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(Guid categoryId, Guid movieId, [FromBody] CategoryDto categoryDto)
        {
            var updatedCategory = await _categoryService.UpdateCategoryAsync(categoryId, movieId, categoryDto);
            var response = new ApiResponse<CategoryDto>
            {
                StatusCode = 200,
                Message = "Update category is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("{categoryId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCategory(Guid categoryId, Guid movieId)
        {
            var isDeleted = await _categoryService.DeleteCategoryComposeAsync(categoryId, movieId);

            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Category was deleted",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}
