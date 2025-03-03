using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.SeatTypeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatTypeController : ControllerBase
    {

        private readonly ISeatTypeService _seatTypeService;

        public SeatTypeController(ISeatTypeService seatTypeService)
        {
            _seatTypeService = seatTypeService;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAllSeatTypesAsync()
        {
            var seatTypes = await _seatTypeService.GetAllAsync();
            return Ok(seatTypes);
        }

        [HttpGet]
        [Route("GetById/{seatTypeId}")]
        public async Task<ActionResult> GetSeatTypeByIdAsync(Guid seatTypeId)
        {
            var seatType = await _seatTypeService.GetByIdAsync(seatTypeId);
            return Ok(seatType);
        }

        [HttpGet]
        [Route("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var seatTypes = await _seatTypeService.GetPageAsync(page, pageSize);
            return Ok(seatTypes);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> CreateSeatType([FromBody] SeatTypeDto seatTypeDto)
        {
            var result = await _seatTypeService.CreateAsync(seatTypeDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpPut]
        [Route("Update/{seatTypeId:guid}")]
        public async Task<ActionResult> UpdateSeatType(Guid seatTypeId, [FromBody] SeatTypeDto seatTypeDto)
        {
            var result = await _seatTypeService.UpdateAsync(seatTypeId, seatTypeDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpDelete]
        [Route("Delete/{seatTypeId:guid}")]
        public async Task<ActionResult> DeleteSeatType(Guid seatTypeId)
        {
            var result = await _seatTypeService.DeleteAsync(seatTypeId);
            if (result)
            {
                return Ok();
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }


    }
}
