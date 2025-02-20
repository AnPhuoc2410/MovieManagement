using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
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
        [HttpGet]
        [Route("{billId:guid}")]
        public async Task<ActionResult<Bill>> GetBillById(Guid billId)
        {
            var bill = await _billService.GetBillAsync(billId);
            return Ok(bill);
        }
        [HttpPost]
        public async Task<ActionResult<Bill>> CreateBill(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto)
        {
            return await _billService.CreateBill(movieId, memberId, employeeId, promotionId, billDto);
        }
        [HttpPut]
        public async Task<ActionResult<Bill>> UpdateBill(Guid billId, BillDto billDto)
        {
            return await _billService.UpdateBillAsync(billId, billDto);
        }
        [HttpDelete]
        public async Task<bool> DeleteBill(Guid billId)
        {
            return await _billService.DeleteBillAsync(billId);
        }
    }
}
