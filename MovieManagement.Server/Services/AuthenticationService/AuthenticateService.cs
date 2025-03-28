﻿using AutoMapper;
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
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.VisualBasic.FileIO;


namespace MovieManagement.Server.Services.AuthorizationService
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;

        public AuthenticateService(IUnitOfWork unitOfWork, IMapper mapper, IUserService userService,
            IJwtService jwtService, IUserRepository userRepository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userService = userService;
            _jwtService = jwtService;
            _userRepository = userRepository;
        }

        public async Task<AuthDto.LoginResponse> Login(AuthDto.LoginRequest dto)
        {
            //Check user name
            var user = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid username/email or password");
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

            var tokenResponse = new TokenDto.TokenResponse();
            tokenResponse.AccessToken = token;
            tokenResponse.Expires = DateTime.UtcNow.AddMinutes(60);

            return new AuthDto.LoginResponse
            {
                Token = tokenResponse
            };
        }

        public UserDto.UserResponse Register(AuthDto.RegisterRequest dto)
        {
            // Check if any of the unique fields already exist
            var existingUser = _userRepository.GetUserByUniqueFields(dto.Email, dto.IDCard, dto.PhoneNumber, dto.UserName);
            if (existingUser != null)
            {
                if (existingUser.Email == dto.Email)
                {
                    throw new MalformedLineException("Email already exists.");
                }
                if (existingUser.IDCard == dto.IDCard)
                {
                    throw new MalformedLineException("ID card already exists.");
                }
                if (existingUser.PhoneNumber == dto.PhoneNumber)
                {
                    throw new MalformedLineException("Phone number already exists.");
                }
                if (existingUser.UserName == dto.UserName)
                {
                    throw new MalformedLineException("Username already exists.");
                }
            }

            var newUser = _mapper.Map<User>(dto);
            newUser.UserName = dto.UserName.Trim();
            newUser.FullName = dto.FullName.Trim();
            
            if (newUser.BirthDate > DateTime.Now) throw new BadRequestException("Birthdate is invalid");
            newUser.BirthDate = dto.BirthDate;
            
            newUser.Email = dto.Email.Trim();
            newUser.Gender = dto.Gender;
            newUser.Status = UserStatus.Active; // Active user
            newUser.JoinDate = DateTime.UtcNow;
            newUser.Address = dto.Address;
            newUser.Avatar = "https://images.dog.ceo/breeds/pembroke/n02113023_1258.jpg";
            newUser.IDCard = dto.IDCard;
            newUser.PhoneNumber = dto.PhoneNumber;
            newUser.Role = 0; //Default role is Member
            newUser.Point = 0;

            // Hash the password
            newUser.Password = new PasswordHasher<User>().HashPassword(newUser, dto.Password);

            // Save to database
            return _mapper.Map<UserDto.UserResponse>(_unitOfWork.UserRepository.Create(newUser));
        }

        public async Task<UserDto.UserResponse> ExtractTokenAsync(string token)
        {
            var jwtToken = _jwtService.ReadTokenWithoutValidation(token);
            if (jwtToken == null)
                throw new BadRequestException("Invalid token");

            var userId = jwtToken.Claims
                .FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var user = await _unitOfWork.UserRepository.GetByIdAsync(Guid.Parse(userId));
            if (user == null)
                throw new NotFoundException("User not found!");

            return _mapper.Map<UserDto.UserResponse>(user);
        }
    }
}