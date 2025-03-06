using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
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
        [Route("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var rooms = await _roomService.GetAllAsync();
            return Ok(rooms);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var rooms = await _roomService.GetPageAsync(page, pageSize);
            return Ok(rooms);
        }


        [HttpGet]
        [Route("GetById/{roomId:guid}")]
        public async Task<ActionResult<RoomDto>> GetRoomById(Guid roomId)
        {
            return await _roomService.GetIdAsync(roomId);
        }


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] RoomDto roomDto)
        {
            return await _roomService.CreateAsync(roomDto);
        }


        [HttpPut]
        [Route("Update/{roomId:guid}")]
        public async Task<ActionResult<RoomDto>> UpdateRoom(Guid roomId, [FromBody] RoomDto roomDto)
        {
            return await _roomService.UpdateAsync(roomId, roomDto);
        }


        [HttpDelete]
        [Route("Delete/{roomId:guid}")]
        public async Task<bool> DeleteRoom(Guid roomId)
        {
            return await _roomService.DeleteAsync(roomId);
        }

        [HttpGet]
        [Route("GetRoomInfo/{roomId:guid}")]
        public async Task<ActionResult<RoomResponseModel>> GetRoomInfo(Guid roomId)
        {
            return await _roomService.GetRoomInfo(roomId);
        }

    }
}
