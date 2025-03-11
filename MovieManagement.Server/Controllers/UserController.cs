﻿using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
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

        /// <summary>
        /// Get All Users
        /// </summary>
        /// <remarks>Awesomeness!</remarks>
        /// <response code="200">Get all users successfully</response>
        /// <response code="400">Bad request from client side</response>
        /// <response code="401" >Unauthorized Access</response>
        /// <response code="500">Internal Server Error</response>
        [HttpGet("all")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserDto.UserResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<UserDto.UserResponse>>> GetAllUSerAsync()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                if (users == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Bill not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }

                return Ok(new ApiResponse<IEnumerable<UserDto.UserResponse>>
                {
                    Message = "Get all users successfully",
                    StatusCode = 200,
                    IsSuccess = true,
                    Data = users
                });
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "Internal Server Error",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        /// <summary>
        /// Get User by Id
        /// </summary>
        /// <response code="200">Get User by Id success</response>
        /// <response code="400">Bad request from client side</response>
        /// <response code="401" >Unauthorized Access</response>
        /// <response code="500">Internal Server Error</response>
        [HttpGet("detail/{userId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(Guid userId)
        {
            try
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
            catch (BadRequestException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating bill",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpGet("role/{role}")]
        [ProducesResponseType(typeof(ApiResponse<List<UserDto.UserResponse>>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserByRoleAsync(Role role)
        {
            var users = await _userService.GetUserByRoleAsync(role);
            if (users == null || users.Count == 0)
            {
                return NotFound(new ApiResponse<object>
                {
                    StatusCode = 404,
                    Message = "No users found for the specified role.",
                    IsSuccess = false
                });
            }

            return Ok(new ApiResponse<List<UserDto.UserResponse>>
            {
                StatusCode = 200,
                Message = "Get user by role successfully",
                IsSuccess = true,
                Data = users
            });
        }

        [HttpPost("extract-token")]
        public async Task<IActionResult> ExtractToken([FromBody] TokenDto.TokenRequest tokenRequest)
        {
            var userData = await _userService.ExtractTokenAsync(tokenRequest.AccessToken);
            if (userData == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    StatusCode = 401,
                    Message = "Invalid token",
                    IsSuccess = false
                });
            }

            return Ok(new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Token extracted successfully",
                IsSuccess = true,
                Data = userData
            });
        }

        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPageAsync(int page, int pageSize)
        {
            try
            {
                var users = await _userService.GetUserPageAsync(page, pageSize);
                if (users == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "User not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }

                return Ok(users);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> CreateUserAsync(UserDto.CreateUser userDto)
        {
            try
            {
                var newUser = await _userService.CreateUserAsync(userDto);
                if (newUser == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "User not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }

                return Ok(newUser);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto>> UpdateUserAsync(Guid userId,
            UserDto.UserRequest userDto)
        {
            try
            {
                var updated = await _userService.UpdateUserAsync(userId, userDto);
                if (updated == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "User not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }

                return Ok(updated);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
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
        [HttpDelete("{empId:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUserAsync(Guid empId)
        {
            try
            {
                var isDeleted = await _userService.DeleteUserAsync(empId);
                if (!isDeleted)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "User not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }

                return NoContent();
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponse<object>
                {
                    StatusCode = 400,
                    Message = "Bad request",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = ex.Message,
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}