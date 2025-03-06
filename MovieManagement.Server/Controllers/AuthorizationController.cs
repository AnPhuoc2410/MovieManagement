using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorizationController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        public AuthorizationController(AppDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("Register")]
        //public async Task<IActionResult> Register(RegisterDto registerDto)
        //{
        //    if (registerDto == null || string.IsNullOrEmpty(registerDto.UserName) || string.IsNullOrEmpty(registerDto.Password))
        //    {
        //        return BadRequest("Invalid registration request.");
        //    }
        //    var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.UserName == registerDto.UserName);
        //    if(existingUser != null)
        //    {
        //        return BadRequest("Username already exist");
        //    }

        //    var user = 
        //    user.Password = _passwordHasher.HashPassword(user, registerDto.Password);
        //    _context.Users.Add(user);
        //    await _context.SaveChangesAsync();
        //    return Ok("Registration successful");
        //}

        [HttpPost("Login")]
        //public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        //{
        //    if (loginDto == null || string.IsNullOrEmpty(loginDto.Username) || string.IsNullOrEmpty(loginDto.Password))
        //    {
        //        return BadRequest("Invalid login request.");
        //    }
        //    var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == loginDto.Username && u.Password == loginDto.Password);

        //    if(user == null)
        //    {
        //        return Unauthorized("Invalid username or password");
        //    }

        //    // Generate a token or set a cookie here
        //    // For example, using JWT:
        //    // var token = GenerateJwtToken(loginDto.Username);

        //    return Ok("Login successful.");
        //}
    }
}
