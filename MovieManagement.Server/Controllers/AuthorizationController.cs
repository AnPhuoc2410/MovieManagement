using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.EmailService;
using System.Threading.Tasks;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizationController : Controller
    {
        private readonly IEmailService _emailService;
        public AuthorizationController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendOtp([FromBody] OtpCodeDto otpCode)
        {
            try
            {
                bool otp = await _emailService.SendOtpEmail(otpCode.Email);
                if (!otp)
                {
                    var response = new ApiResponse<IEnumerable<OtpCodeDto>>
                    {
                        StatusCode = 404,
                        Message = "User not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("verify")]
        [ProducesResponseType(typeof(ApiResponse<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpCodeDto otpCode)
        {
            try
            {
                bool isValid = await _emailService.ValidationOtp(otpCode.Email, otpCode.NewPassword, otpCode.Code);
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
                return Ok();
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
    }
}
