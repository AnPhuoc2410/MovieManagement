using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.BillService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class BillController : Controller
    {
        private readonly IBillService _billService;

        public BillController(IBillService billService)
        {   
            _billService = billService;
        }


        [HttpGet]
        [Route("GetAll")]
        [ProducesResponseType(typeof(ApiResponseServices<TicketTypeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAllBills()
        {
            try
            {
                var bills = await _billService.GetAllAsync();
                var response = new ApiResponseServices<IEnumerable<BillDto>>
                {
                    StatusCode = 200,
                    Message = "Bill retrieved successfully",
                    IsSuccess = true,
                    Data = bills
                };
                return Ok(bills);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<IEnumerable<BillDto>>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 404,
                    Message = "Show time not found",
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
                    Message = "An error occurred while creating show time",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
        [HttpGet("page/{page:int}/pagesize{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            try
            {
                var bills = await _billService.GetPageAsync(page, pageSize);
                if (bills == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Movie not found",
                        IsSuccess = false
                    };
                    return NotFound(response);
                }
                return Ok(bills);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

        [HttpGet]
        [Route("GetById/{billId:guid}")]
        public async Task<ActionResult<BillDto>> GetBillById(Guid billId)
        {
            try
            {
                var bill = await _billService.GetByIdAsync(billId);
                if (bill == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Bill not found",
                        IsSuccess = false
                    };
                    return NotFound(bill);
                }
                return Ok(bill);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<BillDto>> CreateBill(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, [FromBody] BillDto billDto)
        {
            try
            {
            var @new = await _billService.CreateAsync(movieId, memberId, employeeId, promotionId, billDto);
                return Ok(@new);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 404,
                    Message = "Bill not found",
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
                    Message = "An error occurred while creating Bill",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPut]
        [Route("Update/{billId:guid}")]
        public async Task<ActionResult<BillDto>> UpdateBill(Guid billId, [FromBody] BillDto billDto)
        {
            try
            {
            var updated = await _billService.UpdateAsync(billId, billDto);
                if( updated == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Bill not found",
                        IsSuccess = false
                    };
                    return NotFound(updated);
                }
            return Ok(updated);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating bill",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpDelete]
        [Route("Delete/{billId:guid}")]
        public async Task<bool> DeleteBill(Guid billId)
        {
            bool deleted = await _billService.DeleteAsync(billId);
            return deleted;
        }


    }
}
