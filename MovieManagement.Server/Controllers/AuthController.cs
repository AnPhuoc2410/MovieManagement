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
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
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
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<AuthDto.LoginResponse>>> Login(
            [FromBody] AuthDto.LoginRequest loginDto)
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
        
        /// <summary>
        /// Send OTP Code to registered email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPatch("send-otp")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendOtp([FromQuery] string email)
        {
            String otp = await _emailService.SendOtpEmail(email);
            var response = new ApiResponse<String>
            {
                StatusCode = 200,
                Message = "The OTP code was sent",
                Data = otp,
                IsSuccess = true
            };
            return Ok(response);
        }

        /// <summary>
        /// Check if the OTP code is valid for the email
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPatch("otp/verify")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            bool isValid =
                await _emailService.ValidationOtp(request.Email,request.Code);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Reset password is success",
                Data = isValid,
                IsSuccess = true
            };
            return Ok(response);
        }

        /// <summary>
        /// Update user password
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        // [Authorize(Policy = "Member")]
        // [Authorize(Policy = "Employee")]
        // [Authorize(Policy = "Admin")]
        [AllowAnonymous]
        [HttpPatch("update-password")]
        [ProducesResponseType(typeof(ApiResponse<ResetPasswordRequest>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetUserPassword([FromBody] ResetPasswordRequest request)
        {
            await _userService.ChangeUserPasswordByEmail(request.Email, request.CurrentPassword,
                request.NewPassword);
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
        [ProducesResponseType(typeof(ApiResponse<object>),
            StatusCodes.Status500InternalServerError)]
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