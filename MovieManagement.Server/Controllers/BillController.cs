using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
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
        [Route("all")]
        public async Task<ActionResult> GetAllBills()
        {
            var bills = await _billService.GetAllBillsAsync();
            return Ok(bills);
        }
        [HttpGet("page/{page:int}/pagesize{pageSize:int}")]
        public async Task<ActionResult> GetPageAsynce(int page, int pageSize)
        {
            var bills = await _billService.GetPageAsync(page, pageSize);
            return Ok(bills);
        }

        [HttpGet]
        [Route("{billId:guid}")]
        public async Task<ActionResult<BillDto>> GetBillById(Guid billId)
        {
            var bill = await _billService.GetBillByIdAsync(billId);
            return bill;
        }


        [HttpPost]
        public async Task<ActionResult<BillDto>> CreateBill(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto)
        {
            var @new = await _billService.CreateBillAsync(movieId, memberId, employeeId, promotionId, billDto);
            return @new;
        }


        [HttpPut]
        public async Task<ActionResult<BillDto>> UpdateBill(Guid billId, BillDto billDto)
        {
            var updated = await _billService.UpdateBillAsync(billId, billDto);
            return updated;
        }


        [HttpDelete]
        public async Task<bool> DeleteBill(Guid billId)
        {
            bool deleted = await _billService.DeleteBillAsync(billId);
            return deleted;
        }


    }
}
