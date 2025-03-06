using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.BillService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class BillController : Controller//
    {
        private readonly IBillService _billService;

        public BillController(IBillService billService)
        {
            _billService = billService;
        }


        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllBillsAsync()
        {
            var bills = await _billService.GetAllBillsAsync();
            return Ok(bills);
        }
        [HttpGet("page/{page:int}/pagesize{pageSize:int}")]
        public async Task<IActionResult> GetBillPageAsync(int page, int pageSize)
        {
            var bills = await _billService.GetBillPageAsync(page, pageSize);
            return Ok(bills);
        }

        [HttpGet]
        [Route("{billId:guid}")]
        public async Task<ActionResult<BillDto>> GetBillByIdAsync(Guid billId)
        {
            var bill = await _billService.GetBillByIdAsync(billId);
            return bill;
        }
        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetPurchasedTicketsAsync(Guid userId)
        {
            var purchasedTickets = await _billService.GetPurchasedTicketsAsync(userId);
            return Ok(purchasedTickets);
        }
        [HttpPost("user/{userId:guid}")]
        public async Task<ActionResult<BillDto>> CreateBillAsync(Guid userId, [FromBody] BillDto billDto)
        {
            var createdBill = await _billService.CreateBillAsync(userId, billDto);
            return createdBill;
        }


        [HttpPut]
        [Route("{billId:guid}")]
        public async Task<ActionResult<BillDto>> UpdateBillAsync(Guid billId,[FromBody] BillDto billDto)
        {
            var updated = await _billService.UpdateBillAsync(billId, billDto);
            return updated;
        }


        [HttpDelete]
        [Route("Delete/{billId:guid}")]
        public async Task<bool> DeleteBillAsync(Guid billId)
        {
            bool deleted = await _billService.DeleteBillAsync(billId);
            return deleted;
        }


    }
}
