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
        [Route("all")]
        public async Task<IActionResult> GetAllSeatTypesAsync()
        {
            var seatTypes = await _seatTypeService.GetAllSeatTypesAsync();
            return Ok(seatTypes);
        }

        [HttpGet]
        [Route("{seatTypeId}")]
        public async Task<ActionResult<SeatTypeDto>> GetSeatTypeByIdAsync(Guid seatTypeId)
        {
            var seatType = await _seatTypeService.GetSeatTypeByIdAsync(seatTypeId);
            return Ok(seatType);
        }

        [HttpGet]
        [Route("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetSeatTypePageAsync(int page, int pageSize)
        {
            var seatTypes = await _seatTypeService.GetSeatTypePageAsync(page, pageSize);
            return Ok(seatTypes);
        }

        [HttpPost]
        public async Task<ActionResult<SeatTypeDto>> CreateSeatTypeAsync([FromBody] SeatTypeDto seatTypeDto)
        {
            var result = await _seatTypeService.CreateSeatTypeAsync(seatTypeDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpPut]
        [Route("{seatTypeId:guid}")]
        public async Task<ActionResult<SeatTypeDto>> UpdateSeatTypeAsync(Guid seatTypeId, [FromBody] SeatTypeDto seatTypeDto)
        {
            var result = await _seatTypeService.UpdateSeatTypeAsync(seatTypeId, seatTypeDto);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpDelete]
        [Route("{seatTypeId:guid}")]
        public async Task<ActionResult<SeatTypeDto>> DeleteSeatTypeAsync(Guid seatTypeId)
        {
            var result = await _seatTypeService.DeleteSeatTypeAsync(seatTypeId);
            if (result)
            {
                return Ok();
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }


    }
}
