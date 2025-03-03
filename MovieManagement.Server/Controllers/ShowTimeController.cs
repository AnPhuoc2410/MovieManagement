﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.ShowTimeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimeController : ControllerBase
    {
        private readonly IShowTimeService _showTimeService;

        public ShowtimeController(IShowTimeService showTimeService)
        {
            _showTimeService = showTimeService;
        }

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllShowtimeAsync()
        {
            return Ok(await _showTimeService.GetAllShowtimeAsync());
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetShowtimePageAsync(int page, int pageSize)
        {
            var showTimes = await _showTimeService.GetShowtimePageAsync(page, pageSize);
            return Ok(showTimes);
        }


        [HttpGet("movie/{movieId:guid}/room/{roomId:guid}")]
        public async Task<ActionResult<ShowtimeDto>> GetShowtimeByIdAsync(Guid movieId, Guid roomId)
        {
            var showTime = await _showTimeService.GetShowtimeByComposeIdAsync(movieId, roomId);
            if (showTime == null)
            {
                return NotFound();
            }
            return showTime;
        }


        [HttpPost]
        public async Task<ActionResult<ShowtimeDto>> CreateShowtimeAsync([FromBody] ShowtimeDto showTimeDto)
        {
            return await _showTimeService.CreateShowtimeAsync(showTimeDto);
        }


        [HttpPut("movie/{movieId:guid}/room/{roomId:guid}")]
        public async Task<ActionResult<ShowtimeDto>> UpdateShowtimeAsync(Guid movieId, Guid roomId, [FromBody] ShowtimeDto showTimeDto)
        {
            try
            {
                var updateShowTime= _showTimeService.UpdateShowtimeAsync(movieId, roomId, showTimeDto);
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

        [HttpDelete("movie/{movieId:guid}/room/{roomId:guid}")]
        public async Task<IActionResult> DeleteShowtimeAsync(Guid movieId, Guid roomId)
        {
            var result = await _showTimeService.DeleteShowtimeAsync(movieId, roomId);
            if (result)
            {
                return Ok(result);
            }
            return NotFound();
        }
    }
}
