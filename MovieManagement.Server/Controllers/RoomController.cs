using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
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
        public async Task<IActionResult> GetAllRoomAsync()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(rooms);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetRoomPageAsync(int page, int pageSize)
        {
            var rooms = await _roomService.GetRoomPageAsync(page, pageSize);
            return Ok(rooms);
        }


        [HttpGet]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<RoomDto>> GetRoomByIdAsync(Guid roomId)
        {
            return await _roomService.GetRoomByIdAsync(roomId);
        }


        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoomAsync([FromBody] RoomDto roomDto)
        {
            return await _roomService.CreateRoomAsync(roomDto);
        }


        [HttpPut]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<RoomDto>> UpdateRoomAsync(Guid roomId, [FromBody] RoomDto roomDto)
        {
            return await _roomService.UpdateRoomAsync(roomId, roomDto);
        }


        [HttpDelete]
        [Route("{roomId:guid}")]
        public async Task<bool> DeleteRoomAsync(Guid roomId)
        {
            return await _roomService.DeleteRoomAsync(roomId);
        }


    }
}
