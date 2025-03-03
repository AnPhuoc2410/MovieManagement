using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
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
        public async Task<IActionResult> GetAllSeatsAsync()
        {
            var seats = await _seatService.GetAllSeatsAsync();
            return Ok(seats);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetSeatPageAsync(int page, int pageSize)
        {
            var seats = await _seatService.GetSeatPageAsync(page, pageSize);
            return Ok(seats);
        }


        [HttpGet]
        [Route("{seatId:guid}")]
        public async Task<ActionResult<SeatDto>> GetSeatByIdAsync(Guid seatId)
        {
            return await _seatService.GetSeatByIdAsync(seatId);
        }


        [HttpPost]
        public async Task<ActionResult<SeatDto>> CreateSeatAsync([FromBody] SeatDto seatDto)
        {
            return await _seatService.CreateSeatAsync(seatDto);
        }


        [HttpPut]
        [Route("{seatId:guid}")]
        public async Task<ActionResult<SeatDto>> UpdateSeatAsync(Guid seatId, [FromBody] SeatDto seatDto)
        {
            return await _seatService.UpdateSeatAsync(seatId, seatDto);
        }


        [HttpDelete]
        [Route("{seatId:guid}")]
        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            return await _seatService.DeleteSeatAsync(seatId);
        }
    }
}
