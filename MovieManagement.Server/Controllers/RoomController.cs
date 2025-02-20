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
            var rooms = _mapper.Map<List<RoomDto>>(await _roomService.GetAllRoomsAsync());
            return Ok(rooms);
        }
        [HttpGet]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<RoomDto>> GetRoomById(Guid roomId)
        {
            return _mapper.Map<RoomDto>(await _roomService.GetRoomByIdAsync(roomId));
        }
        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] RoomDto roomDto)
        {
            return _mapper.Map<RoomDto>(await _roomService.CreateRoomAsync(_mapper.Map<Room>(roomDto)));
        }
        [HttpPut]
        [Route("{roomId:guid}")]
        public async Task<ActionResult<RoomDto>> UpdateRoom(Guid roomId, [FromBody] RoomDto roomDto)
        {
            return _mapper.Map<RoomDto>(await _roomService.UpdateRoomAsync(roomId, roomDto));
        }
        [HttpDelete]
        public async Task<bool> DeleteRoom(Guid roomId)
        {
            return await _roomService.DeleteRoomAsync(roomId);
        }
    }
}
