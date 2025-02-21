using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketTypeService
{
    public class TicketTypeService : ITicketTypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TicketTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TicketType> CreateTicketType(TicketType ticketType)
        {
            var newTicketType = new TicketType
            {
                Consumer = ticketType.Consumer,
                DayOfWeek = ticketType.DayOfWeek, 
                Hours = ticketType.Hours,
                Price = ticketType.Price,
                Version = ticketType.Version
            };
            return await _unitOfWork.TicketTypeRepository.CreateAsync(newTicketType);
        }

        public async Task<bool> DeleteTicketType(Guid ticketId)
        => await _unitOfWork.TicketTypeRepository.DeleteAsync(ticketId);

        public async Task<IEnumerable<TicketType>> GetAllTicketType()
        => await _unitOfWork.TicketTypeRepository.GetAllAsync();

        public async Task<TicketType> GetTicketType(Guid ticketId)
        {
            var ticket = await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId);
            if (ticket == null)
            {
                throw new Exception("Ticket not found");
            }
            return ticket;
        }

        public async Task<TicketType> UpdateTicketType(Guid ticketId, TicketType ticketType)
        {
            var existingTicketType = await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId);
            if(existingTicketType == null)
            {
                throw new Exception("Promotion not found");
            }
            existingTicketType.Hours = ticketType.Hours;
            existingTicketType.DayOfWeek = ticketType.DayOfWeek;    
            existingTicketType.Price = ticketType.Price;
            existingTicketType.Version = ticketType.Version;
            existingTicketType.Consumer = ticketType.Consumer;
            
            var updateTicketType = await _unitOfWork.TicketTypeRepository.UpdateAsync(existingTicketType);
            return updateTicketType;
        }

    
    }
}
