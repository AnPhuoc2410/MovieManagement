using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Data;
using System.Drawing;
using System.Net;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Exceptions;

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

        public async Task<UserDto> CreateUserAsync(UserDto user)
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
                return _mapper.Map<UserDto>(createdUser);
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

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            try
            {
                var users = await _unitOfWork.UserRepository.GetAllAsync();
                if (users == null)
                    throw new NotFoundException("No users found!");
                return _mapper.Map<List<UserDto>>(users);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
                if (user == null)
                    throw new NotFoundException("User not found!");
                return _mapper.Map<UserDto>(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<UserDto>> GetUserPageAsync(int page, int pageSize)
        {
            try
            {
                var users = await _unitOfWork.UserRepository.GetPageAsync(page, pageSize);
                if (users == null)
                    throw new NotFoundException("Users not found!");
                return _mapper.Map<List<UserDto>>(users);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<UserDto> UpdateUserAsync(Guid id, UserDto userDto)
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
                return _mapper.Map<UserDto>(updatedUser);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }
    }
}
