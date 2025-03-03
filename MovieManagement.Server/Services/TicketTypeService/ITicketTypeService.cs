using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.Runtime.CompilerServices;

namespace MovieManagement.Server.Services.TicketTypeService
{
    public interface ITicketTypeService
    {
        Task<TicketTypeDto> CreateTicketTypeAsync(TicketTypeDto ticketType);
        Task<TicketTypeDto> GetTicketTypeByIdAsync(Guid ticketId);
        Task<IEnumerable<TicketTypeDto>> GetTicketTypePageAsync(int page, int pageSize);
        Task<IEnumerable<TicketTypeDto>> GetAllTicketTypesAsync();
        Task<TicketTypeDto> UpdateTicketTypeAsync( Guid ticketId, TicketTypeDto ticketType);
        Task<bool> DeleteTicketTypeAsync(Guid ticketId);
    }
}
