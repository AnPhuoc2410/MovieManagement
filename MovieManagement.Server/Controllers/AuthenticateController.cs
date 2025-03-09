using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.AuthorizationService;
using NuGet.Packaging.Rules;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticateController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthenticateService _authenticateService;
        public AuthenticateController(IUserRepository userRepository, IAuthenticateService authenticateService )
        {
      
            _userRepository = userRepository;
            _authenticateService = authenticateService;
        }

        [HttpPost("Register")]
        [ProducesResponseType(typeof(ApiResponseServices<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var existingUser = await _userRepository.GetByName(registerDto.UserName, registerDto.Email);
                if (existingUser != null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 409,
                        Message = "User already exists",
                        IsSuccess = false,
                        Reason = "A user with the same username or email already exists."
                    };
                    return Conflict(response);
                }

                var newUser = await _authenticateService.Register(registerDto);
                var successResponse = new ApiResponseServices<UserDto>
                {
                    StatusCode = 200,
                    Message = "User registered successfully",
                    IsSuccess = true,
                    Data = newUser
                };
                return Ok(successResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 404,
                    Message = "Show time not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while creating show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPost("Login")]
        [ProducesResponseType(typeof(ApiResponseServices<LoginResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            try
            {
                var result = await _authenticateService.Login(loginDto);
                var response = new ApiResponseServices<LoginResponseDto>
                {
                    StatusCode = 200,
                    Message = "Login successfully",
                    IsSuccess = true,
                    Data = result
                };
                return Ok(response);
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
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 404,
                    Message = "User not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while logging in",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}
