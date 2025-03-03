

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


        public TicketDetailController(ITicketDetailService ticketDetailService)
        {
            _ticketDetailService = ticketDetailService;
        }


        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAllTicketDetail()
        {
            var ticket = await _ticketDetailService.GetAllAsync();
            return Ok(ticket);
        }



        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var ticketDetails = await _ticketDetailService.GetPageAsync(page, pageSize);
            return Ok(ticketDetails);
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TicketDetailDto>> GetTicketDetail(Guid id)
        {
            var ticket = await _ticketDetailService.GetByIdAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return ticket;
        }


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<TicketDetail>> CreateTicketDetail([FromBody] TicketDetailDto ticketDetail)
        {
            var createdTicketDetail = _ticketDetailService.CreateAsync(ticketDetail);
            return Ok(createdTicketDetail);
        }


        [HttpPut("Update/{id:guid}")]
        public async Task<IActionResult> UpdateTicketDetail(Guid id, [FromBody] TicketDetailDto ticketDetailDto)
        {
            try
            {
                var updateTicket = _ticketDetailService.UpdateAsync(id, ticketDetailDto);
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


        [HttpDelete("Delete/{id:guid}")]
        public async Task<IActionResult> DeleteTicketDetail(Guid id)
        {
            var result = await _ticketDetailService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }



    }
}
