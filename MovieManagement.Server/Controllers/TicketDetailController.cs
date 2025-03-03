

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
        [Route("all")]
        public async Task<IActionResult> GetAllTicketDetailAsync()
        {
            var ticket = await _ticketDetailService.GetAllTicketDetailsAsync();
            return Ok(ticket);
        }



        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetTicketDetailPageAsync(int page, int pageSize)
        {
            var ticketDetails = await _ticketDetailService.GetTicketDetailPageAsync(page, pageSize);
            return Ok(ticketDetails);
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TicketDetailDto>> GetTicketDetailAsync(Guid id)
        {
            var ticket = await _ticketDetailService.GetTicketDetailByIdAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return ticket;
        }


        [HttpPost]
        public async Task<ActionResult<TicketDetailDto>> CreateTicketDetailAsync([FromBody] TicketDetailDto ticketDetail)
        {
            var createdTicketDetail = _ticketDetailService.CreateTicketDetailAsync(ticketDetail);
            return Ok(createdTicketDetail);
        }


        [HttpPut("{id:guid}")]
        public async Task<ActionResult<TicketDetailDto>> UpdateTicketDetailAsync(Guid id, [FromBody] TicketDetailDto ticketDetailDto)
        {
            try
            {
                var UpdateTicketDetail = _ticketDetailService.UpdateTicketDetailAsync(id, ticketDetailDto);
                if (UpdateTicketDetail == null)
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


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteTicketDetailAsync(Guid id)
        {
            var result = await _ticketDetailService.DeleteTicketDetailAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }



    }
}
