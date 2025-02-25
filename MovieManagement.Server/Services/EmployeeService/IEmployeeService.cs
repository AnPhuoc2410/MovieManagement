using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.EmployeeService
{
    public interface IEmployeeService
    {

        Task<EmployeeDto> CreateEmployee(EmployeeDto employee);
        Task<EmployeeDto> GetEmployee(Guid id);
        Task<IEnumerable<EmployeeDto>> GetAllEmployees();
        Task<EmployeeDto> UpdateEmployee(Guid id, EmployeeDto employee);
        Task<bool> DeleteEmployee(Guid id);

    }
}
