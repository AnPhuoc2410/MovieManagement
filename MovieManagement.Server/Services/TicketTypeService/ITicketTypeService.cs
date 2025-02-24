using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.Runtime.CompilerServices;

namespace MovieManagement.Server.Services.TicketTypeService
{
    public interface ITicketTypeService
    {
        Task<ResponseDto> CreateTicketType(TicketTypeDto ticketType);
        Task<ResponseDto> GetTicketType(Guid ticketId);
        Task<ResponseDto> GetAllTicketType();
        Task<ResponseDto> UpdateTicketType( Guid ticketId, TicketTypeDto ticketType);
        Task<bool> DeleteTicketType(Guid ticketId);
    }
}
