

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.TicketDetailServices;
using static MovieManagement.Server.Models.Enums.TicketEnum;

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
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TicketDetailDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllTicketDetailAsync()
        {
            var ticket = await _ticketDetailService.GetAllTicketDetailsAsync();
            var response = new ApiResponse<IEnumerable<TicketDetailDto>>
            {
                StatusCode = 200,
                Message = "Get all ticket is success",
                IsSuccess = true,
                Data = ticket
            };
            return Ok(response);
        }

        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TicketDetailDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTicketDetailPageAsync(int page, int pageSize)
        {
            var ticketDetails = await _ticketDetailService.GetTicketDetailPageAsync(page, pageSize);
            var response = new ApiResponse<IEnumerable<TicketDetailDto>>
            {
                StatusCode = 200,
                Message = "Get all ticket detail is success",
                IsSuccess = true,
                Data = ticketDetails
            };
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<TicketDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<TicketDetailDto>> GetTicketDetailAsync(Guid id)
        {
            var ticket = await _ticketDetailService.GetTicketDetailByIdAsync(id);
            var response = new ApiResponse<TicketDetailDto>
            {
                StatusCode = 200,
                Message = "Get ticket detail is success",
                IsSuccess = true,
                Data = ticket
            };
            return Ok(response);
        }

        [HttpGet("ticket-details")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<PurchasedTicketResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTicketDetails(long billId)
        {
            var ticketDetails = await _ticketDetailService.GetPurchasedTicketsByBillId(billId);
            var response = new ApiResponse<IEnumerable<PurchasedTicketResponse>>
            {
                StatusCode = 200,
                Message = "Get ticket detail is success",
                IsSuccess = true,
                Data = ticketDetails
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<TicketDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<TicketDetailDto>> CreateTicketDetailAsync([FromBody] TicketDetailDto ticketDetail)
        {
            var createdTicketDetail = await _ticketDetailService.CreateTicketDetailAsync(ticketDetail);
            var response = new ApiResponse<TicketDetailDto>
            {
                StatusCode = 200,
                Message = "Create ticket detail is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<TicketDetailDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<TicketDetailDto>> UpdateTicketDetailAsync(Guid id, [FromBody] TicketDetailDto ticketDetailDto)
        {
            var UpdateTicketDetail = await _ticketDetailService.UpdateTicketDetailAsync(id, ticketDetailDto);
            var response = new ApiResponse<TicketDetailDto>
            {
                StatusCode = 200,
                Message = "Update ticket detail is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteTicketDetailAsync(Guid id)
        {
            var isDeleted = await _ticketDetailService.DeleteTicketDetailAsync(id);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Delete ticket detail is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpGet("GetByShowTimeId/{showTimeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TicketDetailResponseModel>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByShowTimeId(Guid showTimeId)
        {
            var ticket = await _ticketDetailService.GetTicketByShowTimeId(showTimeId);
            var response = new ApiResponse<IEnumerable<TicketDetailResponseModel>>
            {
                StatusCode = 200,
                Message = "Get ticket detail is success",
                IsSuccess = true,
                Data = ticket
            };
            return Ok(response);
        }

        [HttpPut("Checkout")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TicketDetailResponseModel>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateTicketToPending([FromBody] List<TicketDetailRequest> Tickets)
        {
            var ticket = await _ticketDetailService.UpdateTicketToPending(Tickets);
            var response = new ApiResponse<IEnumerable<TicketDetailResponseModel>>
            {
                StatusCode = 200,
                Message = "Update ticket detail is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut("ChangeStatus/{status}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TicketDetailResponseModel>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangeStatusTicketDetailAsync([FromBody] List<TicketDetailRequest> Tickets, TicketStatus status)
        {
            var ticketDetail = await _ticketDetailService.ChangeStatusTicketDetailAsync(Tickets, status);
            var response = new ApiResponse<IEnumerable<TicketDetailResponseModel>>
            {
                StatusCode = 200,
                Message = "Change status ticket detail is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete("DeleteRemainingTicket/{showTimeId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteRemainingTicket(Guid showTimeId)
        {
            var isDeleted = await _ticketDetailService.DeleteRemainingTicket(showTimeId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Delete ticket detail is success",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}
