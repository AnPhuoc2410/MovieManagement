using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.RoomService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : Controller
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }


        [HttpGet("all")]
        [ProducesResponseType(typeof(ApiResponse<RoomDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllRoomAsync()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get all rooms is success",
                IsSuccess = true,
                Data = rooms
            };
            return Ok(response);
        }

        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<RoomDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRoomPageAsync(int page, int pageSize)
        {
            var rooms = await _roomService.GetRoomPageAsync(page, pageSize);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get rooms is success",
                IsSuccess = true,
                Data = rooms
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("{roomId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<RoomDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RoomDto>> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _roomService.GetRoomByIdAsync(roomId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get room is success",
                IsSuccess = true,
                Data = room
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<RoomDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RoomDto>> CreateRoomAsync([FromBody] RoomDto roomDto, Guid MovieTheaterId)
        {
            var newRoom = await _roomService.CreateRoomAsync(roomDto, MovieTheaterId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Create room is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{roomId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<RoomDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RoomDto>> UpdateRoomAsync(Guid roomId, [FromBody] RoomDto roomDto)
        {
            var updatedRoom = await _roomService.UpdateRoomAsync(roomId, roomDto);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Update room is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("{roomId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<RoomDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteRoomAsync(Guid roomId)
        {
            var isDeleted = await _roomService.DeleteRoomAsync(roomId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Delete room is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("GetRoomInfo/{roomId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<RoomResponseModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        /// <summary>
        /// Retrieves room information by room ID.
        /// </summary>
        /// <param name="roomId">The ID of the room.</param>
        /// <returns>An IActionResult containing the room information.</returns>
        public async Task<IActionResult> GetRoomInfo(Guid roomId)
        {
            var data = await _roomService.GetRoomInfo(roomId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get room info is success",
                IsSuccess = true,
                Data = data
            };
            return Ok(response);
        }
    }
}
