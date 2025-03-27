using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.UserService;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Get User by Id
        /// </summary>
        /// <response code="200">Get User by Id success</response>
        /// <response code="400">Bad request from client side</response>
        /// <response code="401" >Unauthorized Access</response>
        /// <response code="500">Internal Server Error</response>
        [Authorize(Roles = "Member,Employee,Admin")]
        [HttpGet("detail/{userId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(Guid userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            return Ok(new ApiResponse<UserDto.UserResponse>
            {
                Message = "Get User by Id success",
                StatusCode = 200,
                IsSuccess = true,
                Data = user
            });
        }

        /// <summary>
        /// Get user by specific role     
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        /// <response code="200">Get user by role successfully</response>
        [Authorize(Roles = "Admin")]
        [HttpGet("role/{role}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserDto.UserResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserByRoleAsync(Role role)
        {
            var users = await _userService.GetUserByRoleAsync(role);
            return Ok(new ApiResponse<IEnumerable<UserDto.UserResponse>>
            {
                StatusCode = 200,
                Message = "Get user by role successfully",
                IsSuccess = true,
                Data = users
            });
        }

        /// <summary>
        /// Find user by IdCard Or Phone     
        /// </summary>
        /// <param name="idCard"></param>
        /// <param name="phone"></param>
        /// <response code="200">Find user by IdCard Or Phone successfully</response>
        [Authorize(Roles = "Admin")]
        [HttpGet("find")]
        public async Task<IActionResult> FindUserByIdCardOrPhoneAsync([FromQuery] string? idCard,
            [FromQuery] string? phone)
        {
            var user = new List<UserDto.UserResponse>();
            if (idCard == null)
            {
                user = await _userService.FindUserByPhone(phone);
            }
            else
            {
                user = await _userService.FindUserByIdCard(idCard);
            }

            return Ok(new ApiResponse<List<UserDto.UserResponse>>
            {
                StatusCode = 200,
                Message = "Find user by IdCard Or Phone successfully",
                IsSuccess = true,
                Data = user
            });
        }

        [Authorize(Roles = "Member,Employee,Admin")]
        [HttpGet("page/{page:int}/limit/{limit:int}")]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPageAsync(int page, int limit)
        {
            var users = await _userService.GetUserPageAsync(page, limit);
            return Ok(new ApiResponse<IEnumerable<UserDto.UserResponse>>
            {
                StatusCode = 200,
                Message = "Get user by role successfully",
                IsSuccess = true,
                Data = users
            });
        }
        [HttpGet("users")]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>),
            StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>),
            StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>),
            StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<PagingResponse<UserDto.UserResponse>>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUsersAsync([FromQuery] int? page,
            [FromQuery] int? limit, [FromQuery] string idCard)
        {
            if (page.HasValue && limit.HasValue)
            {
                // Nếu page và limit có giá trị, gọi đến dịch vụ để lấy trang dữ liệu
                var users = await _userService.GetUserPageAsync(page.Value, limit.Value);
                return Ok(new ApiResponse<IEnumerable<UserDto.UserResponse>>
                {
                    StatusCode = 200,
                    Message = "Get paged users successfully",
                    IsSuccess = true,
                    Data = users
                });
            }
            else
            {
                // Nếu không có giá trị page và limit, lấy tất cả người dùng
                var users = await _userService.GetAllUsersAsync();
                return Ok(new ApiResponse<IEnumerable<UserDto.UserResponse>>
                {
                    StatusCode = 200,
                    Message = "Get all users successfully",
                    IsSuccess = true,
                    Data = users
                });
            }
        }

        /// <summary>
        /// Update user by id
        /// </summary>
        /// <param name="userId"></param>
        /// <response code="200">User updated successfully</response>
        [Authorize(Roles = "Member,Employee,Admin")]
        [HttpPatch("{userId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UpdateRequest>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> UpdateUserAsync(Guid userId, UserDto.UpdateRequest updateReq)
        {
            await _userService.UpdateUserAsync(userId, updateReq);
            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "User updated successfully",
                IsSuccess = true,
            });
        }

        /// <summary>
        /// Deletes a user by ID.
        /// </summary>
        /// <remarks>
        /// If the user is successfully deleted, a 204 NoContent is returned.
        /// </remarks>
        /// <param name="id">The ID of the user to delete</param>
        /// <response code="204">User deleted successfully, no content returned</response>
        /// <response code="404">User not found</response>
        /// <response code="400">Bad request from client side</response>
        /// <response code="401" >Unauthorized Access</response>
        /// <response code="500">Internal Server Error</response>
        ///
        [Authorize(Roles = "Admin")]
        [HttpDelete("{empId:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUserAsync(Guid empId)
        {
            await _userService.DeleteUserAsync(empId);
            return NoContent();
        }
    }
}