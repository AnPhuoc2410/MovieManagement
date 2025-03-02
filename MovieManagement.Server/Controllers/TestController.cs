using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.JwtService;
using MovieManagement.Server.Services.UserService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;

        public TestController(IUserService userService, IUnitOfWork unitOfWork, IJwtService jwtService)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }

        [HttpPost("Registration")]
        public async Task<IActionResult> Registration(UserDto userDto)
        {

            var output = await _userService.CreateAsync(userDto);

            return Ok(output);

        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(String userName, String pass)
        {
            var userList = await _userService.GetAllAsync();

            var user = userList.FirstOrDefault(x => x.UserName == userName);


            // Use PasswordHasher to verify the password
            var passwordHasher = new PasswordHasher<UserDto>();

            var result = passwordHasher.VerifyHashedPassword(user, user.Password, pass);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid username/email or password");
            }

            var token = _jwtService.GenerateToken(user.UserId.Value, user.UserName, user.Role.ToString());

            return Ok(new { message = "Login successful", token = token, user = user });

        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            return Ok(await _userService.GetAllAsync());
        }

        [HttpGet]
        [Route("TestAdmin")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> GetHello()
        {
            return Ok("Hello chat!");
        }



    }
}
