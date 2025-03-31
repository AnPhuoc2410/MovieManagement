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
        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public IActionResult Signup([FromBody] AuthDto.RegisterRequest registerDto)
        {
            var newUser = _authenticateService.Register(registerDto);
            return Ok(new ApiResponse<UserDto.UserResponse>
            {
                StatusCode = 200,
                Message = "User register is success",
                IsSuccess = true,
                Data = newUser
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthDto.LoginResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<AuthDto.LoginResponse>>> Login([FromBody] AuthDto.LoginRequest loginDto)
        {
            var result = await _authenticateService.Login(loginDto);
            return Ok(new ApiResponse<AuthDto.LoginResponse>
            {
                StatusCode = 200,
                Message = "User login is success",
                IsSuccess = true,
                Data = result
            });
        }

        [AllowAnonymous]
        [HttpPost("send-opt")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            bool otp = await _emailService.SendOtpEmail(request.Email);
            var response = new ApiResponse<IEnumerable<OtpCodeDto>>
            {
                StatusCode = 200,
                Message = "The OTP code was sended",
                IsSuccess = otp
            };
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("verify/reset-password")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            bool isValid = await _emailService.ValidationOtp(request.Email, request.NewPassword, request.Code);
            var response = new ApiResponse<IEnumerable<OtpCodeDto>>
            {
                StatusCode = 200,
                Message = "Reset password is success",
                IsSuccess = true
            };
            return Ok(response);
        }

        [Authorize(Policy = "Member")]
        [Authorize(Policy = "Employee")]
        [Authorize(Policy = "Admin")]
        [HttpPatch("reset-password")]
        [ProducesResponseType(typeof(ApiResponse<ResetPasswordRequest>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetUserPassword([FromBody] ResetPasswordRequest request)
        {
            await _userService.ChangeUserPasswordByUserId(request.UserId, request.CurrentPassword, request.NewPassword);
            return Ok(new ApiResponse<IEnumerable<ResetPasswordRequest>>
            {
                StatusCode = 200,
                Message = "Reset password is success",
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
        [ProducesResponseType(typeof(ApiResponse<UserDto.UserResponse>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ExtractToken([FromBody] TokenDto.TokenRequest tokenRequest)
        {
            var userData = await _authenticateService.ExtractTokenAsync(tokenRequest.AccessToken);

            return Ok(new ApiResponse<UserDto.UserResponse>
            {
                StatusCode = 200,
                Message = "Token extracted is success",
                IsSuccess = true,
                Data = userData
            });
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Member")]
        [Route("Test")]
        public IActionResult Test()
        {
            return Ok("Test");
        }
    }
}