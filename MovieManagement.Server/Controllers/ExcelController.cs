using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Services.ExcelService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelController : Controller
    {
        private readonly IExcelService _excelService;
        public ExcelController(IExcelService excelService)
        {
            _excelService = excelService;
        }

        [HttpGet("export")]
        public IActionResult ExportToExcel()
        {
            var file = _excelService.ExportToExcel();
            string date = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("vie-vi"));
            string fileName = $"Thong ke - {date}.xlsx";
            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
    }
}
