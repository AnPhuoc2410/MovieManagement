using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.EmailService;
using MovieManagement.Server.Services.UserService;
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

        [HttpPost("OTP/Send")]
        [ProducesResponseType(typeof(ApiResponseServices<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            try
            {
                bool otp = await _emailService.SendOtpEmail(request.Email);
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
                else
                {
                    var response = new ApiResponseServices<IEnumerable<OtpCodeDto>>
                    {
                        StatusCode = 200,
                        Message = "OTP is sended!",
                        IsSuccess = true
                    };
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("OTP/Verify/ChangePassword")]
        [ProducesResponseType(typeof(ApiResponseServices<OtpCodeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpModel request)
        {
            try
            {
                bool isValid = await _emailService.ValidationOtp(request.Email, request.NewPassword, request.Code);
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
                else {
                    var response = new ApiResponseServices<IEnumerable<OtpCodeDto>>
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
                return StatusCode(500, ex.Message);
            }
        }
    }
}
