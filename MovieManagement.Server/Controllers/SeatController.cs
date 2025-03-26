using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.SeatService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class SeatController : Controller
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet]
        [Route("all")]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllSeatsAsync()
        {
            var seats = await _seatService.GetAllSeatAsync();
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get all seats is success",
                IsSuccess = true,
                Data = seats
            };
            return Ok(response);
        }

        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSeatPageAsync(int page, int pageSize)
        {
            var seats = await _seatService.GetSeatPageAsync(page, pageSize);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get seats is success",
                IsSuccess = true,
                Data = seats
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("{seatId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetSeatByIdAsync(Guid seatId)
        {
            var seat = await _seatService.GetSeatByIdAsync(seatId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get seat is success",
                IsSuccess = true,
                Data = seat
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CreateSeatAsync([FromBody] SeatDto seatDto)
        {
            var newSeat = await _seatService.CreateSeatAsync(seatDto);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Seat created successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{seatId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdateSeatAsync(Guid seatId, [FromBody] SeatDto seatDto)
        {
            var updatedSeat = await _seatService.UpdateSeatAsync(seatId, seatDto);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Seat updated successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("{seatId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteSeatAsync(Guid seatId)
        {
            var isDeleted = await _seatService.DeleteSeatAsync(seatId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Seat deleted successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPost]
        [Route("CreateByRoomId")]
        public async Task<ActionResult<ApiResponse<bool>>> CreateByRoomId(Guid roomId, Guid seatTypeId)
        {
            var isCompleted = await _seatService.CreateByRoomIdAsync(roomId, seatTypeId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Seat created successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("UpdateByList")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeatDto>>>> UpdateByList(List<Guid> list, bool isActived)
        {
            var updatedList = await _seatService.UpdateByList(list, isActived);
            var response = new ApiResponse<IEnumerable<SeatDto>>
            {
                StatusCode = 200,
                Message = "Seat updated successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("UpdateByRoomId")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeatDto>>>> UpdateTypeByList(List<Guid> list, Guid seatTypeId)
        {
            var updatedList = await _seatService.UpdateTypeByList(list, seatTypeId);
            var response = new ApiResponse<IEnumerable<SeatDto>>
            {
                StatusCode = 200,
                Message = "Seat updated successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPost]
        [Route("AddRowByRoomId")]
        /// <summary>
        /// Adds a row of seats by room ID and seat type ID.
        /// </summary>
        /// <param name="roomId">The ID of the room.</param>
        /// <param name="seatTypeId">The ID of the seat type.</param>
        /// <returns>An ApiResponse indicating whether the operation was successful.</returns>
        public async Task<ActionResult<ApiResponse<bool>>> AddRowByRoomId(Guid roomId, Guid seatTypeId)
        {
            var isCompleted = await _seatService.AddRowByRoomId(roomId, seatTypeId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Seat created successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPost]
        [Route("AddColumnByRoomId")]
        /// <summary>
        /// Adds a column of seats by room ID and seat type ID.
        /// </summary>
        /// <param name="roomId">The ID of the room.</param>
        /// <param name="seatTypeId">The ID of the seat type.</param>
        /// <returns>An ApiResponse indicating whether the operation was successful.</returns>
        public async Task<ActionResult<ApiResponse<bool>>> AddColumnByRoomId(Guid roomId, Guid seatTypeId)
        {
            var isCompleted = await _seatService.AddColumnByRoomId(roomId, seatTypeId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Seat created successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByRoomId")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeatDto>>>> GetByRoomId(Guid roomId)
        {
            var seats = await _seatService.GetByRoomId(roomId);
            var response = new ApiResponse<IEnumerable<SeatDto>>
            {
                StatusCode = 200,
                Message = "Get seats is success",
                IsSuccess = true,
                Data = seats
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("DeleteByRoomId")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteByRoomId(Guid roomId)
        {
            var isCompleted = await _seatService.DeleteByRoomId(roomId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Seat deleted successfully",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}
