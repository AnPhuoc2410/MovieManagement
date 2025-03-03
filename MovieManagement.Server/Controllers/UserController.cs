using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.UserService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUSerAsync()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        [HttpGet("{userId:guid}")]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(Guid userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            return Ok(user);
        }
        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetPageAsync(int page, int pageSize)
        {

            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUserAsync(UserDto userDto)
        {
            var newUser = await _userService.CreateUserAsync(userDto);
            return Ok(newUser);
        }
        [HttpPut]
        public async Task<ActionResult<UserDto>> UpdateUserAsync(Guid userId, UserDto userDto)
        {
            var updated = await _userService.UpdateUserAsync(userId, userDto);
            return Ok(updated);
        }
        [HttpDelete]
        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            return await _userService.DeleteUserAsync(userId);
        }
    }
}
