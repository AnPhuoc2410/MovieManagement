using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Services.TicketDetailServices;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        private readonly ITicketDetailService _ticketDetailService;

        public TestController(ITicketDetailService ticketDetailService)
        {
            _ticketDetailService = ticketDetailService;
        }

        [HttpGet("ticket-details")]
        public async Task<IActionResult> GetTicketDetails(Guid billId)
        {
            var ticketDetails = await _ticketDetailService.GetPurchasedTicketsByBillId(billId);
            return Ok(ticketDetails);
        }
    }
}
