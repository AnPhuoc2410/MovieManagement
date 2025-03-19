using Microsoft.AspNetCore.Mvc;

namespace MovieManagement.Server.Controllers
{
    public class QRCodeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
