using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.Runtime.CompilerServices;

namespace MovieManagement.Server.Services.TicketTypeService
{
    public interface ITicketTypeService
    {
        Task<TicketType> CreateTicketType(TicketType ticketType);
        Task<TicketType> GetTicketType(Guid ticketId);
        Task<IEnumerable<TicketType>> GetAllTicketType();
        Task<TicketType> UpdateTicketType( Guid ticketId, TicketType ticketType);
        Task<bool> DeleteTicketType(Guid ticketId);
    }
}
