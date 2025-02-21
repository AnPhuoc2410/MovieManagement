

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services.TicketDetailServices;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketDetailController : ControllerBase
    {
        private readonly ITicketDetailService _ticketDetailService;
        private readonly IMapper _mapper;

        public TicketDetailController(ITicketDetailService ticketDetailService, IMapper mapper)
        {
            _ticketDetailService = ticketDetailService;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("GetAllTicketDetail")]
        public async Task<ActionResult> GetAllTicketDetail()
        {
            var ticket = await _ticketDetailService.GetAllTicketDetails();
            return Ok(ticket);
        }

        [HttpPost]
        [Route("CreateTicketDetail")]
        public async Task<ActionResult<TicketDetail>> CreateTicketDetail(TicketDetailDto ticketDetail)
        {
            var createdTicketDetail = _mapper.Map<TicketDetailDto>(await _ticketDetailService.CreateTicketDetail(_mapper.Map<TicketDetail>(ticketDetail)));
            return CreatedAtAction(nameof(GetTicketDetail), new { id = createdTicketDetail.BillId }, createdTicketDetail);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TicketDetailDto>> GetTicketDetail(Guid id)
        {
            var ticket = _mapper.Map<TicketDetailDto>(await _ticketDetailService.GetTicketDetail(id));
            if (ticket == null)
            {
                return NotFound();
            }
            return ticket;
        }

        [HttpPut("UpdateTicketDetail/{id:guid}")]
        public async Task<IActionResult> UpdateTicketDetail(Guid id, TicketDetailDto ticketDetailDto)
        {
            try
            {
                var updateTicket = _mapper.Map<TicketDetailDto>(await
_ticketDetailService.UpdateTicketDetail(id, _mapper.Map<TicketDetail>(ticketDetailDto)));
                if (updateTicket == null)
                {
                    throw new Exception("Nothing were found!");
                }
                return Ok(UpdateTicketDetail);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpDelete("DeleteTicketDetail/{id:guid}")]
        public async Task<IActionResult> DeleteTicketDetail(Guid id)
        {
            var result = await _ticketDetailService.DeleteTicketDetail(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
