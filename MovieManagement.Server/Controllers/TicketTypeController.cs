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
        public async Task<ActionResult<ResponseDto>> GetAllTicketType()
        {
            var TicketTypes =  await _ticketTypeService.GetAllTicketType();
            return TicketTypes;
        }

        [HttpPost]
        [Route("CreateTicketType")]
        public async Task<ActionResult<ResponseDto>> CreateTicketType(TicketTypeDto ticketTypeDto)
        {
            var createdTicketType = await _ticketTypeService.CreateTicketType(ticketTypeDto);
            return createdTicketType;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ResponseDto>> GetTicketType(Guid id)
        {
            var ticket = await _ticketTypeService.GetTicketType(id);
            return ticket;
        }

        [HttpPut("UpdateTicketType/{id:guid}")]
        public async Task<ActionResult<ResponseDto>> UpdateTicketType(Guid id, TicketTypeDto ticketTypeDto)
        {
            
            var updateTicket = await _ticketTypeService.UpdateTicketType(id, ticketTypeDto);
            return updateTicket;
             
        }

    }
}
