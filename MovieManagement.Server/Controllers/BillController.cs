using AutoMapper;
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
        private readonly IMapper _mapper;
        public BillController(IBillService billService, IMapper mapper)
        {
            _billService = billService;
            _mapper = mapper;
        }
        [HttpGet]
        [Route("all")]
        public async Task<ActionResult> GetAllBills()
        {
            var bills = _mapper.Map<List<BillDto>>(await _billService.GetAllBillsAsync());
            return Ok(bills);
        }
        [HttpGet]
        [Route("{billId:guid}")]
        public async Task<ActionResult<BillDto>> GetBillById(Guid billId)
        {
            return _mapper.Map<BillDto>(await _billService.GetBillAsync(billId));
        }
        [HttpPost]
        public async Task<ActionResult<BillDto>> CreateBill(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto)
        {
            return _mapper.Map<BillDto>(await _billService.CreateBillAsync(movieId, memberId, employeeId, promotionId, _mapper.Map<Bill>(billDto)));
        }
        [HttpPut]
        public async Task<ActionResult<BillDto>> UpdateBill(Guid billId, BillDto billDto)
        {
            return _mapper.Map<BillDto>(await _billService.UpdateBillAsync(billId, _mapper.Map<Bill>(billDto)));
        }
        [HttpDelete]
        public async Task<bool> DeleteBill(Guid billId)
        {
            return await _billService.DeleteBillAsync(billId);
        }
    }
}
