using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
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


        public async Task<UserDto> CreateEmployee(UserDto employee)
        {
            User newEmployee = new User
            {
                UserName = employee.AccountName,
                Password = employee.Password,
                BirthDate = employee.BirthDate,
                Address = employee.Address,
                Avatar = employee.Avatar,
                Email = employee.Email,
                FullName = employee.FullName,
                Gender = employee.Gender,
                IDCard = employee.IDCard,
                JoinDate = DateTime.Now,
                Level = employee.Level,
                PhoneNumber = employee.PhoneNumber,
                Status = employee.Status
            };

            return _mapper.Map<UserDto>(await _unitOfWork.EmployeeRepository.CreateAsync(newEmployee));

        }

        public Task<bool> DeleteEmployee(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEmployeeAsynce(Guid id)
        {
            return _unitOfWork.EmployeeRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<UserDto>> GetAllEmployees()
        {
            var employees = await _unitOfWork.EmployeeRepository.GetAllAsync();
            return _mapper.Map<List<UserDto>>(await _unitOfWork.EmployeeRepository.GetAllAsync());
        }

        public async Task<UserDto> GetEmployee(Guid id)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
            if (employee == null)
                return null;
            return _mapper.Map<UserDto>(employee);
        }

        public async Task<IEnumerable<UserDto>> GetPageAsync(int page, int pageSize)
        {
            var employees = await _unitOfWork.EmployeeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<List<UserDto>>(employees);
        }

        public async Task<UserDto> UpdateEmployee(Guid id, UserDto employee)
        {
            var existingEmployee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
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
            existingEmployee.Level = employee.Level;
            existingEmployee.FullName = employee.FullName;
            existingEmployee.Avatar = employee.Avatar;

            return _mapper.Map<UserDto>(await _unitOfWork.EmployeeRepository.UpdateAsync(existingEmployee));
        }

        


    }
}
