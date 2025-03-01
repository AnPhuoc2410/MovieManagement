using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

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


        public async Task<UserDto> CreateUser(UserDto user)
        {
            User newUser = new User
            {
                UserName = user.AccountName,
                Password = user.Password,
                BirthDate = user.BirthDate,
                Address = user.Address,
                Avatar = user.Avatar,
                Email = user.Email,
                FullName = user.FullName,
                Gender = user.Gender,
                IDCard = user.IDCard,
                JoinDate = DateTime.Now,
                Role = user.Level,
                PhoneNumber = user.PhoneNumber,
                Status = user.Status
            };

            // Hash the password
            //var passwordHasher = new PasswordHasher<User>();
            //newUser.Password = passwordHasher.HashPassword(newUser, user.Password);


            return _mapper.Map<UserDto>(await _unitOfWork.UserRepository.CreateAsync(newUser));

        }

        public Task<bool> DeleteUser(Guid id)
        {
            return _unitOfWork.UserRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsers()
        {
            var employees = await _unitOfWork.UserRepository.GetAllAsync();
            return _mapper.Map<List<UserDto>>(await _unitOfWork.UserRepository.GetAllAsync());
        }

        public async Task<UserDto> GetUser(Guid id)
        {
            var employee = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (employee == null)
                return null;
            return _mapper.Map<UserDto>(employee);
        }

        public async Task<UserDto> UpdateUser(Guid id, UserDto employee)
        {
            var existingEmployee = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (existingEmployee == null)
            {
                return null;
            }

            existingEmployee.BirthDate = employee.BirthDate;
            existingEmployee.Gender = employee.Gender;
            existingEmployee.IDCard = employee.IDCard;
            existingEmployee.Email = employee.Email;
            existingEmployee.PhoneNumber = employee.PhoneNumber;
            existingEmployee.Address = employee.Address;
            existingEmployee.Status = employee.Status;
            existingEmployee.Role = employee.Level;
            existingEmployee.FullName = employee.FullName;
            existingEmployee.Avatar = employee.Avatar;

            return _mapper.Map<UserDto>(await _unitOfWork.UserRepository.UpdateAsync(existingEmployee));
        }

        


    }
}
