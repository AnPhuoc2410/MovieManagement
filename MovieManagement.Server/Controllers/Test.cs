using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Test : ControllerBase
    {



        [HttpGet]
        public IActionResult Create(Employee employee)
        {

            AppDbContext context = new AppDbContext();

            return Ok("Hello World");

        }



    }
}
