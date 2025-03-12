using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;
using MovieManagement.Server.Services.EmailService;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Services;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendAuthenticateEmail(string userEmail)
        {
            try
            {
                bool authenticate = await _emailService.sendAuthenticateEmail(userEmail);
                if (!authenticate)
                {
                    var failResponse = new ApiResponse<object>
                    {
                        StatusCode = 400,
                        Message = "Failed to send authenticate email",
                        IsSuccess = false
                    };
                    return BadRequest(failResponse);
                }

                var successResponse = new ApiResponse<object>
                {
                    StatusCode = 200,
                    Message = "Authenticate email send successfully",
                    IsSuccess = true
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
                    Message = "Email not found",
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
                    Message = "An error occurred while sending email",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}
