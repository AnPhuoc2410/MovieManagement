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
using static MovieManagement.Server.Models.Enums.UserEnum;
using System.Runtime.ConstrainedExecution;


namespace MovieManagement.Server.Services.AuthorizationService
{

    public class AuthenticateService : IAuthenticateService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IJwtService _jwtService;
        public AuthenticateService(IUnitOfWork unitOfWork, IMapper mapper, IJwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtService = jwtService;
        }
        public async Task<AuthDto.LoginResponse> Login(AuthDto.LoginRequest dto)
        {

            //Check user name
            var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid username/email or password");
            }

            //Check if user status active
            if(user.Status == UserStatus.Inactive)
            {
                throw new UnauthorizedAccessException("User is not active!");
            }
            // Use PasswordHasher to verify the password
            var passwordHasher = new PasswordHasher<User>();


            //Check password
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new UnauthorizedAccessException("Invalid username/email or password");
            }

            //Method create Token
            var token = _jwtService.GenerateToken(user.UserId, user.UserName, user.Role.ToString());

            return new AuthDto.LoginResponse
            {
                Token = token
            };


        }

        public async Task<UserDto.UserResponse> Register(AuthDto.RegisterRequest dto)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _unitOfWork.UserRepository.GetUserByEmailAsync(dto.Email);
                if (existingUser != null)
                {
                    throw new Exception("Username or email already exists.");
                }
                var newUser = _mapper.Map<User>(dto);
                //// Create new user entity
                newUser.UserId = Guid.NewGuid();
                newUser.UserName = dto.UserName;
                newUser.FullName = dto.FullName;
                newUser.Email = dto.Email;
                newUser.Status = UserStatus.Inactive; // Active user
                newUser.JoinDate = DateTime.UtcNow;
                newUser.Address = dto.Address;
                newUser.Avatar = "";
                newUser.IDCard = "";
                newUser.PhoneNumber = "";
                newUser.Role = 0;
                newUser.Point = 0;
                
                // Hash the password
                var passwordHasher = new PasswordHasher<User>();
                newUser.Password = passwordHasher.HashPassword(newUser, dto.Password);


                // Save to database
                return _mapper.Map<UserDto.UserResponse>(await _unitOfWork.UserRepository.CreateAsync(newUser));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
