﻿using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Services.JwtService;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<bool> ChangeUserPasswordByUserId(Guid userId, string currentPassword,
            string newPassword)
        {
            try
            {
                //Checking userId is existing
                var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
                if (user == null)
                    throw new NotFoundException("User not found!");

                //Checking new password is blank
                if (string.IsNullOrEmpty(newPassword))
                    throw new Exception("New password is blank!");
                Console.WriteLine($"Stored Hashed Password: {user.Password}");
                Console.WriteLine($"Input Password: {currentPassword}");
                //Create PasswordHasher
                var passwordHasher = new PasswordHasher<User>();

                //Verify password
                var verificationResult =
                    passwordHasher.VerifyHashedPassword(user, user.Password, currentPassword);
                Console.WriteLine($"Verification Result: {verificationResult}");
                if (verificationResult == PasswordVerificationResult.Failed)
                    throw new Exception("Current password is incorrect.");

                //Hash new password
                user.Password = passwordHasher.HashPassword(user, newPassword);

                //Update new password
                var updatedUser =
                    await _unitOfWork.UserRepository.ResetUserPasswordByUserIdAsync(userId,
                        user.Password, newPassword);
                if (updatedUser == null)
                    throw new Exception("Failed to change password.");

                return updatedUser;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<bool> RegisterWithGoogle(OAuthRequest account)
        {
            try
            {
                if (await _unitOfWork.UserRepository.IsExistingEmailAsync(account.Email))
                    throw new Exception("Email already exists.");

                var newUser = _mapper.Map<User>(account);
                newUser.UserId = Guid.NewGuid();
                newUser.JoinDate = DateTime.Now;
                var createdUser = await _unitOfWork.UserRepository.CreateAsync(newUser);
                if (createdUser == null)
                    throw new Exception("Failed to create user.");

                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    "An error occurred while creating the user using OAuth.", ex);
            }
        }


        public async Task<UserDto.UserResponse> CreateUserAsync(UserDto.CreateUser user)
        {
            if (user.Role == Role.Admin)
                throw new BadRequestException("Admin cannot be created by this method.");

            if (_unitOfWork.UserRepository.IsExistingEmailOrUsernameOrPhoneOrIdNumber(user.Email,
                    user.UserName, user.PhoneNumber, user.IDCard))
                throw new BadRequestException(
                    "Email, username, phone number or ID number already exists.");

            var newUser = _mapper.Map<User>(user);
            newUser.Password = new PasswordHasher<User>().HashPassword(newUser, user.Password);

            var createdUser = await _unitOfWork.UserRepository.CreateAsync(newUser);

            if (createdUser == null)
                throw new BadRequestException("Failed to create user.");

            return _mapper.Map<UserDto.UserResponse>(createdUser);
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User not found!");

            if (user.Role != Role.Employee)
                throw new BadRequestException("Cannot delete this user role");
            
            if (user.Status == UserStatus.Inactive)
                throw new BadRequestException("User is already inactive!");

            return await _unitOfWork.UserRepository.SoftDeleteAsync(id);
        }

        public async Task<IEnumerable<UserDto.UserResponse>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            if (users == null)
                throw new NotFoundException("User List not found!");
            return _mapper.Map<List<UserDto.UserResponse>>(users);
        }

        public async Task<UserDto.UserResponse> GetUserByIdAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id) ?? throw new BadRequestException("User not found hihi!");
            return _mapper.Map<UserDto.UserResponse>(user);
        }

        public UserDto.UserResponse GetUserByEmail(string email)
        {
            var user = _unitOfWork.UserRepository.GetUserByEmail(email);
            if (user == null)
                throw new NotFoundException("User not found!");
            return _mapper.Map<UserDto.UserResponse>(user);
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

        public async Task<IEnumerable<UserDto.UserResponse>> GetUserPageAsync(int page,
            int pageSize)
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

        public async Task UpdateUserAsync(Guid id, UserDto.UpdateRequest userDto)
        {
            // Check if the user exists
            var existingUser = await _unitOfWork.UserRepository.GetByIdAsync(id)
                               ?? throw new NotFoundException("User not found!");

            // Validate username and email only if they are being changed
            if (userDto.UserName != existingUser.UserName &&
                await _unitOfWork.UserRepository.GetByUsername(userDto.UserName) != null)
                throw new BadRequestException("Username already exists.");

            if (userDto.Email != existingUser.Email &&
                await _unitOfWork.UserRepository.GetUserByEmailAsync(userDto.Email) != null)
                throw new BadRequestException("Email already exists.");

            // Map and update the user
            _mapper.Map(userDto, existingUser);
            await _unitOfWork.UserRepository.UpdateAsync(existingUser);
        }
    }
}