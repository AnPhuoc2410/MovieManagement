using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.EmployeeService
{
    public interface IEmployeeService
    {

        Task<Employee> CreateEmployee(EmployeeDto employee);
        Task<Employee> GetEmployee(Guid id);
        Task<IEnumerable<Employee>> GetAllEmployees();
        Task<Employee> UpdateEmployee(Guid id, EmployeeDto employee);
        Task<bool> DeleteEmployee(Guid id);

    }
}
