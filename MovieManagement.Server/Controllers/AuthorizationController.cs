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

        [HttpPost("send/{email:required}")]
        [ProducesResponseType(typeof(ApiResponseServices<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendOtp(string email)
        {
            try
            {
                bool otp = await _emailService.SendOtpEmail(email);
                if (!otp)
                {
                    var response = new ApiResponseServices<IEnumerable<OtpCodeDto>>
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
                return StatusCode(500, "Internal server error.");
            }
        }
        [HttpPost("verify/email/{email:required}/newpassword/{password:required}/otp/{otp:required}")]
        [ProducesResponseType(typeof(ApiResponseServices<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp(string email, string password, string otp)
        {
            try
            {
                bool isValid = await _emailService.ValidationOtp(email, password, otp);
                if (!isValid)
                {
                    var response = new ApiResponseServices<IEnumerable<OtpCodeDto>>
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
                var response = new ApiResponseServices<object>
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
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
