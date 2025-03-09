using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
            try
            {
                var seats = await _seatService.GetAllSeatAsync();
                if (seats == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Seat not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(seats);
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
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSeatPageAsync(int page, int pageSize)
        {
            try
            {
                var seats = await _seatService.GetSeatPageAsync(page, pageSize);
                if (seats == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Rooms not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(seats);
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
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
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
            try
            {
                var seat = await _seatService.GetSeatByIdAsync(seatId);
                if (seat == null)
                {
                    var respone = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Seat not found",
                        IsSuccess = false
                    };
                    return NotFound(respone);
                }
                return Ok(seat);
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
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<SeatDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CreateSeatAsync([FromBody] SeatDto seatDto)
        {
            try
            {
                var newSeat = await _seatService.CreateSeatAsync(seatDto);
                if (newSeat == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Seat not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(newSeat);
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
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
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
            try
            {
                var updatedSeat = await _seatService.UpdateSeatAsync(seatId, seatDto);
                if (updatedSeat == null)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Seat not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(updatedSeat);
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
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
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
            try
            {
                var isDeleted = await _seatService.DeleteSeatAsync(seatId);
                if (!isDeleted)
                {
                    var response = new ApiResponse<object>
                    {
                        StatusCode = 404,
                        Message = "Seat not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(isDeleted);
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
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponse<object>
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
                var response = new ApiResponse<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPost]
        [Route("CreateByRoomId")]
        public async Task<ActionResult<ApiResponse<bool>>> CreateByRoomId(Guid roomId, Guid seatTypeId)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var isCompleted = await _seatService.CreateByRoomIdAsync(roomId, seatTypeId);

                response.IsSuccess = isCompleted;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat created successfully";
                response.Data = isCompleted;

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not created";

                return NotFound(response);
            }
        }

        [HttpPut]
        [Route("UpdateByList")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeatDto>>>> UpdateByList(List<Guid> list, bool isActived)
        {
            var response = new ApiResponse<IEnumerable<SeatDto>>();
            try
            {
                var updatedList = await _seatService.UpdateByList(list, isActived);
                response.IsSuccess = true;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat updated successfully";
                response.Data = updatedList;
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not updated";
                return NotFound(response);
            }
        }

        [HttpPut]
        [Route("UpdateByRoomId")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeatDto>>>> UpdateTypeByList(List<Guid> list, Guid seatTypeId)
        {
            var response = new ApiResponse<IEnumerable<SeatDto>>();
            try
            {
                var updatedList = await _seatService.UpdateTypeByList(list, seatTypeId);
                response.IsSuccess = true;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat updated successfully";
                response.Data = updatedList;
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not updated";
                return NotFound(response);
            }
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
            var response = new ApiResponse<bool>();
            try
            {
                var isCompleted = await _seatService.AddRowByRoomId(roomId, seatTypeId);
                response.IsSuccess = isCompleted;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat created successfully";
                response.Data = isCompleted;
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not created";
                return NotFound(response);
            }
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
            var response = new ApiResponse<bool>();
            try
            {
                var isCompleted = await _seatService.AddColumnByRoomId(roomId, seatTypeId);
                response.IsSuccess = isCompleted;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat created successfully";
                response.Data = isCompleted;
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not created";
                return NotFound(response);
            }
        }

        [HttpGet]
        [Route("GetByRoomId")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeatDto>>>> GetByRoomId(Guid roomId)
        {
            var response = new ApiResponse<IEnumerable<SeatDto>>();
            try
            {
                var seats = await _seatService.GetByRoomId(roomId);
                response.IsSuccess = true;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat created successfully";
                response.Data = seats;
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not created";
                return NotFound(response);
            }
        }

        [HttpDelete]
        [Route("DeleteByRoomId")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteByRoomId(Guid roomId)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var isCompleted = await _seatService.DeleteByRoomId(roomId);
                response.IsSuccess = isCompleted;
                response.StatusCode = StatusCodes.Status200OK;
                response.Reason = "Successfully";
                response.Message = "Seat created successfully";
                response.Data = isCompleted;
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.IsSuccess = false;
                response.Reason = ex.Message;
                response.Message = "Seat not created";
                return NotFound(response);
            }
        }


    }
}
