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
        [HttpGet]
        [Route("all")]
        public async Task<ActionResult> GetAll()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(rooms);
        }
        [HttpGet]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<Room>> GetRoomById(Guid roomId)
        {
            return await _roomService.GetRoomByIdAsync(roomId);
        }
        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom([FromBody] RoomDto roomDto)
        {
            return await _roomService.CreateRoomAsync(roomDto);
        }
        [HttpPut]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<Room>> UpdateRoom(Guid roomId, [FromBody] RoomDto roomDto)
        {
            return await _roomService.UpdateRoomAsync(roomId, roomDto);
        }
        [HttpDelete]
        public async Task<bool> DeleteRoom(Guid roomId)
        {
            return await _roomService.DeleteRoomAsync(roomId);
        }
    }
}
