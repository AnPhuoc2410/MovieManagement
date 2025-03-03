using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.ShowTimeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimeController : ControllerBase
    {
        private readonly IShowTimeService _showTimeService;

        public ShowtimeController(IShowTimeService showTimeService)
        {
            _showTimeService = showTimeService;
        }

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllShowtimeAsync()
        {
            return Ok(await _showTimeService.GetAllShowtimeAsync());
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetShowtimePageAsync(int page, int pageSize)
        {
            var showTimes = await _showTimeService.GetShowtimePageAsync(page, pageSize);
            return Ok(showTimes);
        }


        [HttpGet("movie/{movieId:guid}/room/{roomId:guid}")]
        public async Task<ActionResult<ShowtimeDto>> GetShowtimeByIdAsync(Guid movieId, Guid roomId)
        {
            var showTime = await _showTimeService.GetShowtimeByComposeIdAsync(movieId, roomId);
            if (showTime == null)
            {
                return NotFound();
            }
            return showTime;
        }


        [HttpPost]
        public async Task<ActionResult<ShowtimeDto>> CreateShowtimeAsync([FromBody] ShowtimeDto showTimeDto)
        {
            return await _showTimeService.CreateShowtimeAsync(showTimeDto);
        }


        [HttpPut("movie/{movieId:guid}/room/{roomId:guid}")]
        public async Task<ActionResult<ShowtimeDto>> UpdateShowtimeAsync(Guid movieId, Guid roomId, [FromBody] ShowtimeDto showTimeDto)
        {
            try
            {
                var updateShowTime = await _showTimeService.UpdateShowTime(movieId, roomId, showTimeDto);
                var updateShowTime= _showTimeService.UpdateShowtimeAsync(movieId, roomId, showTimeDto);
                if (updateShowTime == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Show Time not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(updateShowTime);
            }
            catch(BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
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
                var response = new ApiResponseServices<object>
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
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpDelete("movie/{movieId:guid}/room/{roomId:guid}")]
        public async Task<IActionResult> DeleteShowtimeAsync(Guid movieId, Guid roomId)
        {
            var result = await _showTimeService.DeleteShowtimeAsync(movieId, roomId);
            if (result)
            {
                return Ok(result);
            }
            return NotFound();
        }
    }
}
