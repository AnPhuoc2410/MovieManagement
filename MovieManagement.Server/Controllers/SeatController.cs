using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
        [Route("GetAll")]
        public async Task<ActionResult> GetAllSeatsAsync()
        {
            var seats = await _seatService.GetAllAsync();
            return Ok(seats);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var seats = await _seatService.GetPageAsync(page, pageSize);
            return Ok(seats);
        }


        [HttpGet]
        [Route("GetById/{seatId:guid}")]
        public async Task<SeatDto> GetSeatByIdAsync(Guid seatId)
        {
            return await _seatService.GetByIdAsync(seatId);
        }


        [HttpPost]
        [Route("Create")]
        public async Task<SeatDto> CreateSeatAsync([FromBody] SeatDto seatDto)
        {
            return await _seatService.CreateAsync(seatDto);
        }

        [HttpPost]
        [Route("CreateByRoomId")]
        public async Task<ActionResult<ApiResponseServices<bool>>> CreateByRoomId(Guid roomId, Guid seatTypeId)
        {
            var response = new ApiResponseServices<bool>();
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
                response.Data = false;

                return NotFound(response);
            }
        }


        [HttpPut]
        [Route("Update/{seatId:guid}")]
        public async Task<SeatDto> UpdateSeatAsync(Guid seatId, [FromBody] SeatDto seatDto)
        {
            return await _seatService.UpdateAsync(seatId, seatDto);
        }


        [HttpDelete]
        [Route("Delete/{seatId:guid}")]
        public async Task<bool> DeleteSeatAsync(Guid seatId)
        {
            return await _seatService.DeleteAsync(seatId);
        }


    }
}
