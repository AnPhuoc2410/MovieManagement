using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.BillService;
using MovieManagement.Server.Services.EmailService;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class BillController : Controller
    {
        private readonly IBillService _billService;
        private readonly IEmailService _emailService;

        public BillController(IBillService billService, IEmailService emailService)
        {
            _billService = billService;
            _emailService = emailService;
        }


        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<BillDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAllBills()
        {
            var bills = await _billService.GetAllBillsAsync();
            var response = new ApiResponse<IEnumerable<BillDto>>
            {
                StatusCode = 200,
                Message = "Get all bills are a success",
                IsSuccess = true,
                Data = bills
            };
            return Ok(response);
        }
        [HttpGet("page/{page:int}/size/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<BillDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetBillPages(int page, int pageSize)
        {
            var bills = await _billService.GetBillPageAsync(page, pageSize);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get bills are a success",
                IsSuccess = true,
                Data = bills
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("{billId:long}")]
        [ProducesResponseType(typeof(ApiResponse<BillDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BillDto>> GetBillById(long billId)
        {
            var bill = await _billService.GetBillByIdAsync(billId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Get bill is success",
                IsSuccess = true,
                Data = bill
            };
            return Ok(response);
        }

        [HttpPost("email/send-bill")]
        public ActionResult<bool> GetBillByEmail(long billId)
        {
            var result = _emailService.SendEmailReportBill(billId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Send bill by email is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<BillDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BillDto>> CreateBill(Guid userId, [FromBody] BillRequest billRequest, long paymentId)
        {
            var newBill = await _billService.CreateBillAsync(userId, billRequest, paymentId);
            var response = new ApiResponse<object>
            {
                StatusCode = 200,
                Message = "Create bill is success",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}
