using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.UserService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("all")]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllUSerAsync()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        [HttpGet("{userId:guid}")]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(Guid userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            return Ok(user);
        }
        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPageAsync(int page, int pageSize)
        {

            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> CreateUserAsync(UserDto userDto)
        {
            var newUser = await _userService.CreateUserAsync(userDto);
            return Ok(newUser);
        }
        [HttpPut]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> UpdateUserAsync(Guid userId, UserDto userDto)
        {
            var updated = await _userService.UpdateUserAsync(userId, userDto);
            return Ok(updated);
        }
        [HttpDelete]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUserAsync(Guid userId)
        {
            try
            {
                var isDeleted = await _userService.DeleteUserAsync(userId);
                if (!isDeleted)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Bill not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(isDeleted);
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
                return BadRequest(response);
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
                    Message = "An error occurred while deleting show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}
