using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public interface ITicketDetailService
    {
        Task<TicketDetail> CreateTicketDetail(TicketDetail ticketDetail);
        Task<TicketDetail> GetTicketDetail(Guid ticketId);
        Task<IEnumerable<TicketDetail>> GetAllTicketDetails();
        Task<TicketDetail> UpdateTicketDetail(Guid id, TicketDetail ticketDetail);
        Task<bool> DeleteTicketDetail(Guid id);
    }
}
