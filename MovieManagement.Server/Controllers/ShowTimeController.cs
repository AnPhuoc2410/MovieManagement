using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.ShowTimeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowTimeController : ControllerBase
    {
        private readonly IShowTimeService _showTimeService;

        public ShowTimeController(IShowTimeService showTimeService)
        {
            _showTimeService = showTimeService;
        }

        [HttpGet]
        [Route("GetAllShowTime")]
        [ProducesResponseType(typeof(ApiResponse<ShowTimeInfo>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAllShowTime()
        {
            var ListShowTime = await _showTimeService.GetAllShowtime();
            var response = new ApiResponse<IEnumerable<ShowTimeInfo>>
            {
                StatusCode = 200,
                Message = "Get showtime is success",
                IsSuccess = true,
                Data = ListShowTime
            };
            return Ok(response);
        }

        [HttpPost]
        [Route("CreateShowTime")]
        [ProducesResponseType(typeof(ApiResponse<ShowTimeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ShowTimeDto>> CreateShowTime(ShowTimeDto showTimeDto)
        {
            var createdShowTime = await _showTimeService.CreateShowtimeAsync(showTimeDto);
            var response = new ApiResponse<ShowTimeDto>
            {
                StatusCode = 200,
                Message = "Get showtime created success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpGet("{showTimeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<ShowTimeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ShowTimeDto>> GetShowTime(Guid showTimeId)
        {
            var showTime = await _showTimeService.GetShowtimeByIdAsync(showTimeId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get showtime is success",
                IsSuccess = true,
                Data = showTime
            };
            return Ok(response);
        }

        [HttpPut("UpdateShowTime/{showTimeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<ShowTimeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateShowTime(Guid showTimeId, ShowTimeDto showTimeDto)
        {
            var updateShowTime = await _showTimeService.UpdateShowtimeAsync(showTimeId, showTimeDto);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Update showtime is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete("Delete/{showTimeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<ShowTimeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteShowTime(Guid showTimeId)
        {
            var result = await _showTimeService.DeleteShowtimeAsync(showTimeId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Deleted showtime is success",
                IsSuccess = true
            };
            return Ok(response);
        }

        [HttpGet("GetShowTimeByDates")]
        [ProducesResponseType(typeof(ApiResponse<Dictionary<string, List<Dictionary<string, object>>>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetShowTimeFromDateToDate(Guid movieId, DateTime fromDate, DateTime toDate, string location)
        {
            var showTime = await _showTimeService.GetShowTimeFromDateToDate(movieId, fromDate, toDate, location);

            var response = new ApiResponse<Dictionary<string, List<Dictionary<string, object>>>>
            {
                StatusCode = 200,
                Message = "Show Time retrieved successfully",
                IsSuccess = true,
                Data = showTime
            };

            return Ok(response);
        }
    }
}