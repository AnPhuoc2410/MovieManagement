using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
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
        public async Task<ActionResult> GetAllTicketType()
        {
            return Ok(await _ticketTypeService.GetAllTicketType());
        }

        [HttpPost]
        [Route("CreateTicketType")]
        public async Task<ActionResult<TicketType>> CreateTicketType(TicketTypeDto ticketTypeDto)
        {
            var createdTicketType = await _ticketTypeService.CreateTicketType(ticketTypeDto);
            return Ok(createdTicketType);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TicketTypeDto>> GetTicketType(Guid id)
        {
            var ticket = await _ticketTypeService.GetTicketType(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return ticket;
        }

        [HttpPut("UpdateTicketType/{id:guid}")]
        public async Task<IActionResult> UpdateTicketType(Guid id, TicketTypeDto ticketTypeDto)
        {
            try
            {
                var updateTicket = _ticketTypeService.UpdateTicketType(id, ticketTypeDto);
                if (updateTicket == null)
                {
                    throw new Exception("Nothing were found!");
                }
                return Ok(UpdateTicketType);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

    }
}
