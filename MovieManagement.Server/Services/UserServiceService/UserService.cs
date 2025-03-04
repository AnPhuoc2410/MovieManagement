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
            var newUser = _mapper.Map<User>(user);
            // Hash the password
            var passwordHasher = new PasswordHasher<User>();
            newUser.Password = passwordHasher.HashPassword(newUser, user.Password);
            newUser.UserId = Guid.NewGuid();
            var createdUser = await _unitOfWork.UserRepository.CreateAsync(newUser);
            return _mapper.Map<UserDto>(createdUser);

        }

        public Task<bool> DeleteUserAsync(Guid id)
        {
            return _unitOfWork.UserRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            return _mapper.Map<List<UserDto>>(await _unitOfWork.UserRepository.GetAllAsync());
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (user == null)
                return null;
            return _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetUserPageAsync(int page, int pageSize)
        {
            var users = await _unitOfWork.UserRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<UserDto> UpdateUserAsync(Guid id, UserDto user)
        {
            var existingUser = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return null;
            }

            existingUser.BirthDate = user.BirthDate;
            existingUser.Address = user.Address; 
            existingUser.Avatar = user.Avatar;
            existingUser.Email = user.Email;
            existingUser.FullName = user.FullName;
            existingUser.Gender = user.Gender;
            existingUser.IDCard = user.IDCard;
            existingUser.Role = user.Role;
            existingUser.JoinDate = user.JoinDate;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Status = user.Status;
            existingUser.Point = user.Status;

            return _mapper.Map<UserDto>(await _unitOfWork.UserRepository.UpdateAsync(existingUser));
        }
    }
}
