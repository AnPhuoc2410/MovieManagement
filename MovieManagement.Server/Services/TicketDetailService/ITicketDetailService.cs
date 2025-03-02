using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public interface ITicketDetailService
    {
        Task<TicketDetailDto> CreateAsync(TicketDetailDto ticketDetail);
        Task<TicketDetailDto> GetByIdAsync(Guid ticketId);
        Task<IEnumerable<TicketDetailDto>> GetPageAsync(int  page, int pageSize);
        Task<IEnumerable<TicketDetailDto>> GetAllAsync();
        Task<TicketDetailDto> UpdateAsync(Guid id, TicketDetailDto ticketDetail);
        Task<bool> DeleteAsync(Guid id);
    }
}
