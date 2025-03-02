using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.Runtime.CompilerServices;

namespace MovieManagement.Server.Services.TicketTypeService
{
    public interface ITicketTypeService
    {
        Task<TicketTypeDto> CreateTicketType(TicketTypeDto ticketType);
        Task<TicketTypeDto> GetTicketType(Guid ticketId);
        Task<IEnumerable<TicketTypeDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<TicketTypeDto>> GetAllTicketType();
        Task<TicketTypeDto> UpdateTicketType( Guid ticketId, TicketTypeDto ticketType);
        Task<bool> DeleteTicketType(Guid ticketId);
    }
}
