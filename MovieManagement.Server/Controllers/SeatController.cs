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
        public async Task<ActionResult> GetAllSeatsAsync()
        {
            var seats = await _seatService.GetAllSeatsAsync();
            return Ok(seats);
        }


        [HttpGet]
        [Route("{seatId:guid}")]
        public async Task<SeatDto> GetSeatByIdAsync(Guid seatId)
        {
            return await _seatService.GetSeatByIdAsync(seatId);
        }


        [HttpPost]
        public async Task<SeatDto> CreateSeatAsync(SeatDto seatDto)
        {
            return await _seatService.CreateSeatAsync(seatDto);
        }


        [HttpPut]
        public async Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seatDto)
        {
            return await _seatService.UpdateSeatAsync(seatId, seatDto);
        }


        [HttpDelete]
        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            return await _seatService.DeleteSeatAsync(seatId);
        }


    }
}
