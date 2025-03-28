using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.SeatTypeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatTypeController : ControllerBase
    {

        private readonly ISeatTypeService _seatTypeService;

        public SeatTypeController(ISeatTypeService seatTypeService)
        {
            _seatTypeService = seatTypeService;
        }

        [HttpGet]
        [Route("all")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<SeatTypeDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllSeatTypesAsync()
        {
            var seatTypes = await _seatTypeService.GetAllSeatTypesAsync();
            var response = new ApiResponse<IEnumerable<SeatTypeDto>>
            {
                StatusCode = 200,
                Message = "Get all seat types is success",
                IsSuccess = true,
                Data = seatTypes
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("{seatTypeId}")]
        [ProducesResponseType(typeof(ApiResponse<SeatTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<SeatTypeDto>> GetSeatTypeByIdAsync(Guid seatTypeId)
        {
            var seatType = await _seatTypeService.GetSeatTypeByIdAsync(seatTypeId);
            var response = new ApiResponse<SeatTypeDto>
            {
                StatusCode = 200,
                Message = "Get seat type is success",
                IsSuccess = true,
                Data = seatType
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<SeatTypeDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSeatTypePageAsync(int page, int pageSize)
        {
            var seatTypes = await _seatTypeService.GetSeatTypePageAsync(page, pageSize);

            var response = new ApiResponse<IEnumerable<SeatTypeDto>>
            {
                StatusCode = 200,
                Message = "Get seat type is success",
                IsSuccess = true,
                Data = seatTypes
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<SeatTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<SeatTypeDto>> CreateSeatTypeAsync([FromBody] SeatTypeDto seatTypeDto)
        {
            var seat = await _seatTypeService.CreateSeatTypeAsync(seatTypeDto);
            var response = new ApiResponse<SeatTypeDto>
            {
                StatusCode = 200,
                Message = "Create seat type is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{seatTypeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<SeatTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<SeatTypeDto>> UpdateSeatTypeAsync(Guid seatTypeId, [FromBody] SeatTypeDto seatTypeDto)
        {
            var seat = await _seatTypeService.UpdateSeatTypeAsync(seatTypeId, seatTypeDto);
            var response = new ApiResponse<SeatTypeDto>
            {
                StatusCode = 200,
                Message = "Update seat type is success",
                IsSuccess = false
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("{seatTypeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteSeatTypeAsync(Guid seatTypeId)
        {
            bool isDeleted = await _seatTypeService.DeleteSeatTypeAsync(seatTypeId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Delete seat is success",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}
