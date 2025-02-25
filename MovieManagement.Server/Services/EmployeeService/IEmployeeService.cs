using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.EmployeeService
{
    public interface IEmployeeService
    {

        Task<EmployeeDto> CreateEmployeeAsync(EmployeeDto employee);
        Task<EmployeeDto> GetEmployeeByIdAsync(Guid id);
        Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
        Task<EmployeeDto> UpdateEmployeeAsync(Guid id, EmployeeDto employee);
        Task<bool> DeleteEmployeeAsynce(Guid id);

    }
}
