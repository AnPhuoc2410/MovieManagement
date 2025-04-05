using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Services.TranslationService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        private readonly ITestTranslationService _testTranslationService;

        public TestController(ITestTranslationService testTranslationService)
        {
            _testTranslationService = testTranslationService;
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            var products = _testTranslationService.GetTestModels();
            return Ok(products);
        }
    }
}
