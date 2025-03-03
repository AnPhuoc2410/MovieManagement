using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.TicketTypeService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TicketTypeController : ControllerBase
    {
        private readonly ITicketTypeService _ticketTypeService;


        public TicketTypeController(ITicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]

        [HttpGet]
        [Route("all")]
        public async Task<ActionResult<ApiResponseServices<IEnumerable<TicketTypeDto>>>> GetAllTicketTypesAsync()
        {
            try
            {
                var ListTicketTypes = await _ticketTypeService.GetAllTicketTypesAsync();

                var response = new ApiResponseServices<IEnumerable<TicketTypeDto>>
                {
                    StatusCode = 200,
                    Message = "Ticket AtColumn retrieved successfully",
                    IsSuccess = true,
                    Data = ListTicketTypes
                };

                return Ok(response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<IEnumerable<TicketTypeDto>>
                {
                    StatusCode = 404,
                    Message = "Ticket AtColumn not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseServices<TicketTypeDto>>> CreateTicketTypeAsync(TicketTypeDto ticketTypeDto)
        {
            try
            {
                var createdTicketType = await _ticketTypeService.CreateTicketTypeAsync(ticketTypeDto);

                var response = new ApiResponseServices<TicketTypeDto>
                {
                    StatusCode = 201,
                    Message = "Ticket AtColumn created successfully",
                    IsSuccess = true,
                    Data = createdTicketType
                };

                return response;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ApiResponseServices<TicketTypeDto>>> GetTicketTypeByIdAsync(Guid id)
        {
            try
            {
                var ticket = await _ticketTypeService.GetTicketTypeByIdAsync(id);

                var response = new ApiResponseServices<TicketTypeDto>
                {
                    StatusCode = 200,
                    Message = "Ticket AtColumn retrieved successfully",
                    IsSuccess = true,
                    Data = ticket
                };

                return response;
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetTicketTypePageAsync(int page, int pageSize)
        {
            var tickets = await _ticketTypeService.GetTicketTypePageAsync(page, pageSize);
            return Ok(tickets);
        }
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ApiResponseServices<TicketTypeDto>>> UpdateTicketTypeAsync(Guid id, TicketTypeDto ticketTypeDto)
        {
            try
            {
                var updateTicket = await _ticketTypeService.UpdateTicketTypeAsync(id, ticketTypeDto);

                var response = new ApiResponseServices<TicketTypeDto>
                {
                    StatusCode = 200,
                    Message = "Ticket AtColumn updated successfully",
                    IsSuccess = true,
                    Data = updateTicket
                };

                return response;
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
