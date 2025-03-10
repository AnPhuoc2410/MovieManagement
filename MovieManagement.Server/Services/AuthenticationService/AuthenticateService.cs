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
using MovieManagement.Server.Exceptions;
using Microsoft.VisualBasic;


namespace MovieManagement.Server.Services.AuthorizationService
{

    public class AuthenticateService : IAuthenticateService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        public AuthenticateService(IUnitOfWork unitOfWork, IMapper mapper, IUserService userService, IJwtService jwtService, IUserRepository userRepository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userService = userService;
            _jwtService = jwtService;
            _userRepository = userRepository;
        }
        public async Task<LoginResponseDto> Login(LoginRequestDto dto)
        {
            try
            {
                //Check user name
                var user = await _userRepository.GetByName(dto.Username, dto.Email);
                if (user == null)
                {
                    throw new UnauthorizedAccessException("Invalid username/email or password");
                }

                // Use PasswordHasher to verify the password
                var passwordHasher = new PasswordHasher<User>();
                user.Password = passwordHasher.HashPassword(user, dto.Password); // Store this in DB

                //Check password
                var result = passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);
                if (result == PasswordVerificationResult.Failed)
                {
                    throw new UnauthorizedAccessException("Invalid username/email or password");
                }

                //Method create Token
                var token = _jwtService.GenerateToken(user.UserId, user.UserName, user.Role.ToString());

                return new LoginResponseDto
                {
                    Token = token
                };
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while logging in");
            }
        }

        public async Task<UserDto> Register(RegisterDto dto)
        {
            // Check if user already exists
            var existingUser = await _userRepository.GetByName(dto.UserName, dto.Email);
            if (existingUser != null)
            {
                throw new Exception("Username or email already exists.");
            }

            // Create new user entity
            var user = new User
            {
                UserId = Guid.NewGuid(),
                UserName = dto.UserName,
                FullName = dto.FullName,
                Email = dto.Email,
                Status = 1, // Active user
                JoinDate = DateTime.UtcNow,
                Address = dto.Address,
                Avatar = "",
                IDCard = "",
                PhoneNumber = "",
                Role = 0,
                Point = 0
            };
            // Hash the password
            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, dto.Password);

            // Save to database
            return _mapper.Map<UserDto>(await _userService.CreateAsync(_mapper.Map<UserDto>(user)));
        }
    }
}
