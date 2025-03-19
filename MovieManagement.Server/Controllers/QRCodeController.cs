using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Services.QRService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QRCodeController : Controller
    {
        private readonly IQRCodeService _qrCodeService;

        public QRCodeController(IQRCodeService qrCodeService)
        {
            _qrCodeService = qrCodeService;
        }

        [HttpPut("verify")]
        public async Task<ActionResult> CheckQRCode(string code)
        {
            bool isValid = await _qrCodeService.CheckQRCode(code);
            if (isValid)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
