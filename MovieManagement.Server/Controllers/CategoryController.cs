using Azure;
using Microsoft.AspNetCore.Mvc;
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


        [HttpGet("GetAll")]
        [ProducesResponseType(typeof(ApiResponseServices<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                if (categories == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Categories not found",
                        IsSuccess = false
                    };
                    return NotFound();
                }
                return Ok(categories);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating category",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponseServices<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategoryPageAsync(int page, int pageSize)
        {
            try
            {
                var categories = await _categoryService.GetCategoryPageAsync(page, pageSize);
                if (categories == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Categories not found",
                        IsSuccess = false
                    };
                    return NotFound();
                }
                return Ok(categories);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating category",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpGet("/{categoryId:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Category>> GetCategoryById(Guid categoryId)
        {
            try
            {
                var category = await _categoryService.GetCategoryByComposeIdAsync(categoryId);
                if(category == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Category not found",
                        IsSuccess = false
                    };
                    return NotFound();
                }
                return Ok(category);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating category",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPost]
        [Route("Create")]
        [ProducesResponseType(typeof(ApiResponseServices<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CategoryDto>> CreateCategoryAsync([FromBody] CategoryDto categoryDto)
        {
            try
            {
                var newCategory = await _categoryService.CreateCategoryAsync(categoryDto);
                if(newCategory == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Category not found",
                        IsSuccess = false
                    };
                    return NotFound();
                }
                return Ok(newCategory);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating category",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPut]
        [Route("Update/{categoryId:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CategoryDto>> UpdateCategoryAsync(Guid categoryId, [FromBody] CategoryDto categoryDto)
        {
            try
            {
                var updatedCategory = await _categoryService.UpdateCategoryAsync(categoryId, categoryDto);
                if (updatedCategory == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Category not found",
                        IsSuccess = false
                    };
                    return NotFound();
                }
                return Ok(updatedCategory);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating category",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpDelete]
        [Route("Delete/{categoryId:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCategoryAsync(Guid categoryId)
        {
            try
            {
                var deleteCategory = await _categoryService.DeleteCategoryComposeAsync(categoryId);
                if (!deleteCategory)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Category not found",
                        IsSuccess = false
                    };
                    return NotFound(deleteCategory);
                }
                return Ok(deleteCategory);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating category",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}
