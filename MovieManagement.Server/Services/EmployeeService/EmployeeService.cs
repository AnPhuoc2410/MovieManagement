using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EmployeeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        public async Task<EmployeeDto> CreateEmployeeAsync(EmployeeDto employee)
        {
            Employee newEmployee = new Employee
            {
                AccountName = employee.AccountName,
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

            return _mapper.Map<EmployeeDto>(await _unitOfWork.EmployeeRepository.CreateAsync(newEmployee));

        }

        public Task<bool> DeleteEmployeeAsynce(Guid id)
        {
            return _unitOfWork.EmployeeRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _unitOfWork.EmployeeRepository.GetAllAsync();
            return _mapper.Map<List<EmployeeDto>>(await _unitOfWork.EmployeeRepository.GetAllAsync());
        }

        public async Task<EmployeeDto> GetEmployeeByIdAsync(Guid id)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
            if (employee == null)
                return null;
            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> UpdateEmployeeAsync(Guid id, EmployeeDto employee)
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

            return _mapper.Map<EmployeeDto>(await _unitOfWork.EmployeeRepository.UpdateAsync(existingEmployee));
        }

        


    }
}
