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
        private readonly IMapper _mapper;

        public TicketTypeController(ITicketTypeService ticketTypeService, IMapper mapper)
        {
            _ticketTypeService = ticketTypeService;
            _mapper = mapper;
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
            var createdTicketType = (await _ticketTypeService.CreateTicketType(_mapper.Map<TicketType>(ticketTypeDto)));
            return Ok(createdTicketType);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TicketTypeDto>> GetTicketType(Guid id)
        {
            var ticket = _mapper.Map<TicketTypeDto>(await
                _ticketTypeService.GetTicketType(id));
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
                var updateTicket = _mapper.Map<TicketTypeDto>(await
_ticketTypeService.UpdateTicketType(id, _mapper.Map<TicketType>(ticketTypeDto)));
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
