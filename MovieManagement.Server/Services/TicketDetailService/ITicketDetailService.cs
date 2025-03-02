using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public interface ITicketDetailService
    {
        Task<TicketDetailDto> CreateTicketDetail(TicketDetailDto ticketDetail);
        Task<TicketDetailDto> GetTicketDetail(Guid ticketId);
        Task<IEnumerable<TicketDetailDto>> GetPageAsync(int  page, int pageSize);
        Task<IEnumerable<TicketDetailDto>> GetAllTicketDetails();
        Task<TicketDetailDto> UpdateTicketDetail(Guid id, TicketDetailDto ticketDetail);
        Task<bool> DeleteTicketDetail(Guid id);
    }
}
