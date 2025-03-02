using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.ShowTimeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowTimeController : ControllerBase
    {
        private readonly IShowTimeService _showTimeService;

        public ShowTimeController(IShowTimeService showTimeService)
        {
            _showTimeService = showTimeService;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAllShowTime()
        {
            return Ok(await _showTimeService.GetAll());
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var showTimes = await _showTimeService.GetPageAsync(page, pageSize);
            return Ok(showTimes);
        }


        [HttpGet("GetById/{movieId:guid}/{roomId:guid}")]
        public async Task<ActionResult<ShowTimeDto>> GetShowTime(Guid movieId, Guid roomId)
        {
            var showTime = await _showTimeService.GetByComposeId(movieId, roomId);
            if (showTime == null)
            {
                return NotFound();
            }
            return showTime;
        }


        [HttpPost]
        [Route("CreateAsync")]
        public async Task<ActionResult<ShowTimeDto>> CreateShowTime([FromBody] ShowTimeDto showTimeDto)
        {
            return await _showTimeService.CreateAsync(showTimeDto);
        }


        [HttpPut("Update/{movieId:guid}/{roomId:guid}")]
        public async Task<IActionResult> UpdateShowTime(Guid movieId, Guid roomId, [FromBody] ShowTimeDto showTimeDto)
        {
            try
            {
                var updateShowTime= _showTimeService.UpdateAsync(movieId, roomId, showTimeDto);
                if (updateShowTime == null)
                {
                    throw new Exception("Nothing were found!");
                }
                return Ok(updateShowTime);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("Delete/{movieId:guid}/{roomId:guid}")]
        public async Task<IActionResult> DeleteShowTime(Guid movieId, Guid roomId)
        {
            var result = await _showTimeService.DeleteAsync(movieId, roomId);
            if (result)
            {
                return Ok(result);
            }
            return NotFound();
        }

    }
}
