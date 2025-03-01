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

        [HttpGet]
        [Route("GetAllTicketType")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponseServices<IEnumerable<TicketTypeDto>>>> GetAllTicketType()
        {
            try
            {
                var ListTicketTypes = await _ticketTypeService.GetAllTicketType();

                var response = new ApiResponseServices<IEnumerable<TicketTypeDto>>
                {
                    StatusCode = 200,
                    Message = "Ticket Type retrieved successfully",
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
                    Message = "Ticket Type not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }



        }

        [HttpPost]
        [Route("CreateTicketType")]
        public async Task<ActionResult<ApiResponseServices<TicketTypeDto>>> CreateTicketType(TicketTypeDto ticketTypeDto)
        {
            try
            {
                var createdTicketType = await _ticketTypeService.CreateTicketType(ticketTypeDto);

                var response = new ApiResponseServices<TicketTypeDto>
                {
                    StatusCode = 201,
                    Message = "Ticket Type created successfully",
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
        public async Task<ActionResult<ApiResponseServices<TicketTypeDto>>> GetTicketType(Guid id)
        {
            try
            {
                var ticket = await _ticketTypeService.GetTicketType(id);

                var response = new ApiResponseServices<TicketTypeDto>
                {
                    StatusCode = 200,
                    Message = "Ticket Type retrieved successfully",
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

        [HttpPut("UpdateTicketType/{id:guid}")]
        public async Task<ActionResult<ApiResponseServices<TicketTypeDto>>> UpdateTicketType(Guid id, TicketTypeDto ticketTypeDto)
        {
            try
            {
                var updateTicket = await _ticketTypeService.UpdateTicketType(id, ticketTypeDto);

                var response = new ApiResponseServices<TicketTypeDto>
                {
                    StatusCode = 200,
                    Message = "Ticket Type updated successfully",
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
