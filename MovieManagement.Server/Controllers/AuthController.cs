using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.AuthorizationService;
using MovieManagement.Server.Services.EmailService;
using MovieManagement.Server.Services.UserService;

namespace MovieManagement.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IUserService _userService;
        private readonly IAuthenticateService _authenticateService;
        private readonly IEmailService _emailService;

        public AuthController(IUserService userService, IAuthenticateService authenticateService,
            IEmailService emailService)
        {
            _authenticateService = authenticateService;
            _emailService = emailService;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public IActionResult Signup([FromBody] AuthDto.RegisterRequest registerDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var newUser = _authenticateService.Register(registerDto);
            return Ok(new ApiResponse<UserDto.UserResponse>
            {
                StatusCode = 200,
                Message = "User registered successfully",
                IsSuccess = true,
                Data = newUser
            });
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        [ProducesResponseType(typeof(ApiResponse<AuthDto.LoginResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<AuthDto.LoginResponse>>> Login([FromBody] AuthDto.LoginRequest loginDto)
        {
            var result = await _authenticateService.Login(loginDto);
            return Ok(new ApiResponse<AuthDto.LoginResponse>
            {
                StatusCode = 200,
                Message = "Login successfully",
                IsSuccess = true,
                Data = result
            });
        }

        [AllowAnonymous]
        [HttpPost("OTP/Send")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
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

        [AllowAnonymous]
        [HttpPost("OTP/Verify/ChangePassword")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            try
            {
                bool isValid = await _emailService.ValidationOtp(request.Email, request.NewPassword,
                    request.Code);
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

        [Authorize(Policy = "Member")]
        [Authorize(Policy = "Employee")]
        [Authorize(Policy = "Admin")]
        [HttpPatch("Update-Password")]
        [ProducesResponseType(typeof(ApiResponse<ResetPasswordRequest>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetUserPassword([FromBody] ResetPasswordRequest request)
        {
            await _userService.ChangeUserPasswordByUserId(request.UserId,
                request.CurrentPassword, request.NewPassword);
            return Ok(new ApiResponse<IEnumerable<ResetPasswordRequest>>
            {
                StatusCode = 200,
                Message = "Change password successfully",
                IsSuccess = true
            });
        }

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