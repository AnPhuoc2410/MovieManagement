﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
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
        [Route("GetAllShowTime")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAllShowTime()
        {
            try
            {
                var ListShowTime = await _showTimeService.GetAllShowtime();
                var response = new ApiResponseServices<IEnumerable<ShowTimeDto>>
                {
                    StatusCode = 200,
                    Message = "Show Time retrieved successfully",
                    IsSuccess = true,
                    Data = ListShowTime
                };
                return Ok(response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<IEnumerable<ShowTimeDto>>
                {
                    StatusCode = 404,
                    Message = "Show Time not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving show times",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPost]
        [Route("CreateShowTime")]
        public async Task<ActionResult<ShowTimeDto>> CreateShowTime(ShowTimeDto showTimeDto)
        {
            try
            {
                var createdShowTime = await _showTimeService.CreateShowTime(showTimeDto);
                return Ok(createdShowTime);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while creating show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpGet("{movieId:guid}/{roomId:guid}")]
        public async Task<ActionResult<ShowTimeDto>> GetShowTime(Guid movieId, Guid roomId)
        {
            try
            {
                var showTime = await _showTimeService.GetShowtime(movieId, roomId);
                if (showTime == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Show Time not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(showTime);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpPut("UpdateShowTime/{id:guid}")]
        public async Task<IActionResult> UpdateShowTime(Guid movieId, Guid roomId, ShowTimeDto showTimeDto)
        {
            try
            {
                var updateShowTime = await _showTimeService.UpdateShowTime(movieId, roomId, showTimeDto);
                if (updateShowTime == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Show Time not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(updateShowTime);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}
