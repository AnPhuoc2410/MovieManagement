using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.JwtService;
using MovieManagement.Server.Services.UserService;
using Microsoft.AspNetCore.Http.HttpResults;
using MovieManagement.Server.Repositories.IRepositories;


namespace MovieManagement.Server.Services.AuthorizationService
{

    public class AuthorizationService : IAuthorizationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        public AuthorizationService(IUnitOfWork unitOfWork, IMapper mapper, IUserService userService, IJwtService jwtService, IUserRepository userRepository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userService = userService;
            _jwtService = jwtService;
            _userRepository = userRepository;
        }
        public Task<LoginDto> Login(LoginDto dto)
        {
            //Check user name
            var user = _userRepository.GetByName(dto.Username);

            // Use PasswordHasher to verify the password
            var passwordHasher = new PasswordHasher<User>();

            //Check password
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);

            //MEthod create Token
            var token = _jwtService.GenerateToken(user.UserId, user.UserName, user.Role.ToString());

            if (result == PasswordVerificationResult.Success)
            {
                return _mapper.Map<LoginDto>(result);

            }


        }

        public Task<RegisterDto> Register(RegisterDto dto)
        {
            var output = await _userService.CreateAsync(userDto);

            return Ok(output);

        }
    }
}
