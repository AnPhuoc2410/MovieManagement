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
        [Route("GetAll")]
        public async Task<ActionResult> GetAllBills()
        {
            var bills = await _billService.GetAllAsync();
            return Ok(bills);
        }
        [HttpGet("page/{page:int}/pagesize{pageSize:int}")]
        public async Task<ActionResult> GetPageAsynce(int page, int pageSize)
        {
            var bills = await _billService.GetPageAsync(page, pageSize);
            return Ok(bills);
        }

        [HttpGet]
        [Route("GetById/{billId:guid}")]
        public async Task<ActionResult<BillDto>> GetBillById(Guid billId)
        {
            var bill = await _billService.GetByIdAsync(billId);
            return bill;
        }


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<BillDto>> CreateBill(Guid userId, [FromBody] BillDto billDto)
        {
            var @new = await _billService.CreateAsync(userId, billDto);
            return @new;
        }


        [HttpPut]
        [Route("Update/{billId:guid}")]
        public async Task<ActionResult<BillDto>> UpdateBill(Guid billId,[FromBody] BillDto billDto)
        {
            var updated = await _billService.UpdateAsync(billId, billDto);
            return updated;
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
