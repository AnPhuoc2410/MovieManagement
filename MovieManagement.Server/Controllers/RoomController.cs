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
        private readonly IMapper _mapper;

        public RoomController(IRoomService roomService, IMapper mapper)
        {
            _roomService = roomService;
            _mapper = mapper;
        }
        [HttpGet]
        [Route("all")]
        public async Task<ActionResult> GetAll()
        {
            var rooms = (await _roomService.GetAllRooms());
            return Ok(rooms);
        }
        [HttpGet]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<Room>> GetRoomById(Guid roomId)
        {
            var room = await _roomService.GetRoomById(roomId);
            return Ok(room);
        }
        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom([FromBody] RoomDto roomDto)
        {
            var newRoom = await _roomService.CreateRoom(roomDto);
            return Ok(newRoom);
        }
        [HttpPut]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<Room>> UpdateRoom(Guid roomId, [FromBody] RoomDto roomDto)
        {
            var updateRoom = await _roomService.UpdateRoom(roomId, roomDto);
            return updateRoom;
        }
        [HttpDelete]
        public async Task<bool> DeleteRoom(Guid roomId)
        {
            bool isDeleted = await _roomService.DeleteRoom(roomId);
            return isDeleted;
        }
    }
}
