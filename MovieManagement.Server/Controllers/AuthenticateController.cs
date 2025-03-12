using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.AuthorizationService;
using MovieManagement.Server.Services.EmailService;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using MovieManagement.Server.Services.UserService;

namespace MovieManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticateController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IAuthenticateService _authenticateService;
        private readonly IEmailService _emailService;

        public AuthenticateController(IUserRepository userRepository, IUserService userService, IAuthenticateService authenticateService, IEmailService emailService)
        {

            _userRepository = userRepository;
            _authenticateService = authenticateService;
            _emailService = emailService;
            _userService = userService;
        }

        [HttpPost("Register")]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserDto.UserResponse>> Register([FromBody] AuthDto.RegisterRequest registerDto)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 409,
                        Message = "User already exists",
                        IsSuccess = false,
                        Reason = "A user with the same email already exists."
                    };
                    return Conflict(response);
                }

                var newUser = await _authenticateService.Register(registerDto);
                var successResponse = new ApiResponse<UserDto.UserResponse>
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
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 404,
                    Message = ex.Message,
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while creating user",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPost("Login")]
        [ProducesResponseType(typeof(ApiResponse<AuthDto.LoginResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<AuthDto.LoginResponse>>> Login([FromBody] AuthDto.LoginRequest loginDto)
        {
            try
            {
                var result = await _authenticateService.Login(loginDto);
                var response = new ApiResponse<AuthDto.LoginResponse>
                {
                    StatusCode = 200,
                    Message = "Login successfully",
                    IsSuccess = true,
                    Data = result
                };
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
                {
                    StatusCode = 401,
                    Message = "Invalid credentials",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
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
                return BadRequest(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred during login",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPost("OTP/Send")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            try
            {
                bool otp = await _emailService.SendOtpEmail(request.Email);

                if (otp)
                {
                    var response = new ApiResponse<IEnumerable<OtpCodeDto>>
                    {
                        StatusCode = 200,
                        Message = "OTP is sended!",
                        IsSuccess = true
                    };
                    return Ok(response);
                }
                else
                {
                    var response = new ApiResponse<IEnumerable<OtpCodeDto>>
                    {
                        StatusCode = 404,
                        Message = "User not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("OTP/Verify/ChangePassword")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            try
            {
                bool isValid = await _emailService.ValidationOtp(request.Email, request.NewPassword, request.Code);
                if (!isValid)
                {
                    var response = new ApiResponse<IEnumerable<OtpCodeDto>>
                    {
                        StatusCode = 404,
                        Message = "Otp not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                else
                {
                    var response = new ApiResponse<IEnumerable<OtpCodeDto>>
                    {
                        StatusCode = 200,
                        Message = "Change password successfully",
                        IsSuccess = true
                    };
                    return Ok(response);
                }
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
                return BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("ResetPassword")]
        [ProducesResponseType(typeof(ApiResponse<ResetPasswordRequest>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetUserPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                bool isValid = await _userService.ChangeUserPasswordByUserId(request.UserId, request.CurrentPassword, request.NewPassword);
                if (!isValid)
                {
                    var response = new ApiResponse<IEnumerable<ResetPasswordRequest>>
                    {
                        StatusCode = 404,
                        Message = "Reset password is not fail!",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                else
                {
                    var response = new ApiResponse<IEnumerable<ResetPasswordRequest>>
                    {
                        StatusCode = 200,
                        Message = "Change password successfully",
                        IsSuccess = true
                    };
                    return Ok(response);
                }
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
                return BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //[HttpPost("GoogleAuth/Login")]
        //public async Task<IActionResult> Login()
        //{
        //    var properties = new AuthenticationProperties { RedirectUri = "/GoogleAuth/Callback" };
        //    return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        //}

        //[HttpGet("GoogleAuth/Callback")]
        //[ProducesResponseType(typeof(ApiResponse<AuthDto>), StatusCodes.Status200OK)]
        //[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        //public async Task<IActionResult> Callback()
        //{
        //    try
        //    {
        //        var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        //        if (result.Succeeded != true)
        //        {
        //            return BadRequest("External authentication error");
        //        }

        //        var email = result.Principal.FindFirstValue(ClaimTypes.Email);
        //        var name = result.Principal.FindFirstValue(ClaimTypes.Name);
        //        var picture = result.Principal.FindFirstValue("picture");

        //        if (email == null)
        //        {
        //            return BadRequest("Failed to get user information from Google");
        //        }

        //        var account = new OAuthRequest
        //        {
        //            Email = email,
        //            FullName = name,
        //            Avatar = picture
        //        };

        //        await _userService.RegisterWithGoogle(account);

        //        var identity = new ClaimsIdentity(GoogleDefaults.AuthenticationScheme);
        //        identity.AddClaim(new Claim(ClaimTypes.Email, email));
        //        identity.AddClaim(new Claim(ClaimTypes.Name, name));
        //        identity.AddClaim(new Claim("picture", picture));

        //        var principal = new ClaimsPrincipal(identity);
        //        await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, principal);
        //        return Redirect("/");
        //    }
        //    catch (Exception ex)
        //    {
        //        var response = new ApiResponse<object>
        //        {
        //            StatusCode = 400,
        //            Message = "Bad request from client side",
        //            IsSuccess = false,
        //            Reason = ex.Message
        //        };
        //        return BadRequest(response);
        //    }
        //}

        //[HttpPost("Logout")]
        //public async Task<IActionResult> Logout()
        //{
        //    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        //    return Redirect("/");
        //}
        
        /// <summary>
        /// Extract User Data From Token
        /// </summary>
        /// <response code="200">Token extracted successfully</response>
        /// <response code="401">Invalid token</response>
        // [Authorize(Policy = "Admin")]
        // [Authorize(Policy = "Employee")]
        // [Authorize(Policy = "Member")]
        [HttpPost("extract-token")]
        public async Task<IActionResult> ExtractToken([FromBody] TokenDto.TokenRequest tokenRequest)
        {
            var userData = await _authenticateService.ExtractTokenAsync(tokenRequest.AccessToken);
            if (userData == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    StatusCode = 400,
                    Message = "User not found",
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
    }
}
