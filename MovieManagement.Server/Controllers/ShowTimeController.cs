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
        private readonly IMapper _mapper;

        public ShowTimeController(IShowTimeService showTimeService, IMapper mapper)
        {
            _showTimeService = showTimeService;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("GetAllShowTime")]
        public async Task<ActionResult> GetAllShowTime()
        {
            return Ok(await _showTimeService.GetAllShowtime());
        }

        [HttpPost]
        [Route("CreateShowTime")]
        public async Task<ActionResult<ShowtimeDto>> CreateShowTime
        (ShowtimeDto showTimeDto)
        {
            return Ok (_mapper.Map<ShowtimeDto>(await _showTimeService.CreateShowTime(_mapper.Map<Showtime>(showTimeDto))));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ShowtimeDto>> GetShowTime(Guid id)
        {
            var showTime = _mapper.Map<ShowtimeDto>(await
                _showTimeService.GetShowtime(id));
            if (showTime == null)
            {
                return NotFound();
            }
            return showTime;
        }

        [HttpPut("UpdateShowTime/{id:guid}")]
        public async Task<IActionResult> UpdateShowTime(Guid id, ShowtimeDto showTimeDto)
        {
            try
            {
                var updateShowTime= _mapper.Map<ShowtimeDto>(await
_showTimeService.UpdateShowTime(id, _mapper.Map<Showtime>(showTimeDto)));
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

    }
}
