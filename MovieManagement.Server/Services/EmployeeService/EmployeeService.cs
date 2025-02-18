using Microsoft.AspNetCore.Http.HttpResults;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {

        private readonly IUnitOfWork _unitOfWork;

        public EmployeeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public Task<Employee> CreateEmployee(EmployeeDto employee)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteEmployee(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Employee>> GetAllEmployees()
        {
            var employees = await _unitOfWork.EmployeeRepository.GetAllAsync();
            return employees;
        }

        public async Task<Employee> GetEmployee(Guid id)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetByIdAsync(id);
            if (employee == null)
            {
                return null;
            }
            return employee;
        }

        public async Task<Employee> UpdateEmployee(Guid id, EmployeeDto employee)
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

            var updatedEmployee = await _unitOfWork.EmployeeRepository.UpdateAsync(existingEmployee);
            return updatedEmployee;
        }

        public async Task<ResponseDto> GetAllv2()
        {

            var employees = await _unitOfWork.EmployeeRepository.GetAllAsync();
            ResponseDto response = new ResponseDto();
            if (employees == null)
            {
                response.IsSucceeded = false;
                response.StatusMessage = "Failed";
                response.Message = "No employee found!";
                response.StatusCode = StatusCodes.Status404NotFound;
                return response;
            }
            response.Message = "Success";
            response.Data = employees;

            return response;

        }
    }
}
