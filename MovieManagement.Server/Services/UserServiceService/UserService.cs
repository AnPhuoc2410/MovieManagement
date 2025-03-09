﻿using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Data;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Services.JwtService;

namespace MovieManagement.Server.Services.UserService
{
    public class UserService : IUserService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IJwtService _jwtService;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IJwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtService = jwtService;
        }
        
        public async Task<UserDto.UserResponse> CreateUserAsync(UserDto.CreateUser user)
        {
            try
            {
                var newUser = _mapper.Map<User>(user);
                var passwordHasher = new PasswordHasher<User>();
                newUser.Password = passwordHasher.HashPassword(newUser, user.Password);
                newUser.UserId = Guid.NewGuid();
                var createdUser = await _unitOfWork.UserRepository.CreateAsync(newUser);
                if (createdUser == null)
                    throw new Exception("Failed to create user.");
                return _mapper.Map<UserDto.UserResponse>(createdUser);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into the database.", ex);
            }
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (user == null)
                    throw new NotFoundException("User not found!");

                return await _unitOfWork.UserRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public Task<UserDto.UserResponse> ExtractTokenAsync(string token)
        {

            var jwtToken = _jwtService.ReadTokenWithoutValidation(token);
            if(jwtToken == null)
                throw new Exception("Invalid token");
            
            var userId = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var user = _unitOfWork.UserRepository.GetByIdAsync(Guid.Parse(userId));
            if (user == null)
                throw new NotFoundException("User not found!");
            
            return Task.FromResult(_mapper.Map<UserDto.UserResponse>(user));

        }

        public async Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync()
        {
            try
            {
                var users = await _unitOfWork.UserRepository.GetAllAsync();
                if (users == null)
                    throw new NotFoundException("No users found!");
                return _mapper.Map<List<UserDto.UserResponse>>(users);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<UserDto.UserResponse> GetUserByIdAsync(Guid id)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (user == null)
                    throw new NotFoundException("User not found!");
                return _mapper.Map<UserDto.UserResponse>(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<List<UserDto.UserResponse>> GetUserByRoleAsync(Role role)
        {
            try
            {
                var usersList = await _unitOfWork.UserRepository.GetUserByRoleAsync(role);
                if (usersList == null)
                    throw new NotFoundException("Users not found!");

                return _mapper.Map<List<UserDto.UserResponse>>(usersList);
            }
            catch (Exception ex)
            {
                throw new Exception("Error:", ex);
            }
        }

        public async Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page, int pageSize)
        {
            try
            {
                var users = await _unitOfWork.UserRepository.GetPageAsync(page, pageSize);
                if (users == null)
                    throw new NotFoundException("Users not found!");
                return _mapper.Map<List<UserDto.UserResponse>>(users);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<UserDto.UserResponse> UpdateUserAsync(Guid id, UserDto.UserRequest userDto)
        {
            try
            {
                //Checking user is existing
                var existingUser = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (existingUser == null)
                    throw new NotFoundException("User not found!");

                //password hasher
                var passwordHasher = new PasswordHasher<User>();
                existingUser.Password = passwordHasher.HashPassword(existingUser, userDto.Password);

                // Map updated fields from userDto to existingUser
                _mapper.Map(userDto, existingUser);

                var updatedUser = await _unitOfWork.UserRepository.UpdateAsync(existingUser);
                if (updatedUser == null)
                    throw new DbUpdateException("Fail to update user.");
                return _mapper.Map<UserDto.UserResponse>(updatedUser);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }
    }
}
