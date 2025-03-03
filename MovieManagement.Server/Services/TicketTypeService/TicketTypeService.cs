using AutoMapper;
using Azure;
using Microsoft.Data.SqlClient;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketTypeService
{
    public class TicketTypeService : ITicketTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TicketTypeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<TicketTypeDto> CreateTicketTypeAsync(TicketTypeDto ticketType)
        {
            var newTicketType = _mapper.Map<TicketType>(ticketType);

            try
            {
                var createdTicketType = await _unitOfWork.TicketTypeRepository.CreateAsync(newTicketType);

                return _mapper.Map<TicketTypeDto>(createdTicketType);

            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while processing into Database", ex);
            }

        }

        public async Task<bool> DeleteTicketTypeAsync(Guid ticketId)
        {
            try
            {
                var ticketType = await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId);
                //Checking existing if not return.
                if (ticketType == null)
                {
                    //Thrown exception here.
                    throw new NotFoundException("TicketType does not found!");
                }
                return await _unitOfWork.TicketTypeRepository.DeleteAsync(ticketType);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<TicketTypeDto>> GetAllTicketTypesAsync()
        {
            var ticketTypes = _mapper.Map<List<TicketTypeDto>>(await _unitOfWork.TicketTypeRepository.GetAllAsync());

            if (ticketTypes.Count == 0)
            {
                //Thrown exception here.
                throw new NotFoundException("TicketType does not found!");
            }
            return ticketTypes;
            
        }
        public async Task<IEnumerable<TicketTypeDto>> GetTicketTypePageAsync(int page, int pageSize)
        {
            var ticketTypes = await _unitOfWork.TicketTypeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<TicketTypeDto>>(ticketTypes);
        }
        public async Task<TicketTypeDto> GetTicketTypeByIdAsync(Guid ticketId)
        {

            try
            {
                var ticketType = _mapper.Map<TicketTypeDto>(await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId));

                //Checking existing if not return.
                if (ticketType == null)
                {
                    //Thrown exception here.
                    throw new NotFoundException("TicketType does not found!");
                }

                return ticketType;
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<TicketTypeDto> UpdateTicketTypeAsync(Guid ticketId, TicketTypeDto ticketType)
        {
            try
            {
                if (ticketType == null)
                {
                    throw new ArgumentNullException("TicketType", "TicketType is null");
                }

                var existingTicketType = await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId);

                //Checking exist if not return.
                if (existingTicketType == null)
                {
                    //Thrown exception here.
                    throw new NotFoundException("TicketType does not found!");
                }
                //Update Existing TicketType here:
                existingTicketType.Hours = ticketType.Hours;
                existingTicketType.DayOfWeek = ticketType.DayOfWeek;
                existingTicketType.Price = ticketType.Price;
                existingTicketType.Version = ticketType.Version;
                existingTicketType.Consumer = ticketType.Consumer;

                var updatedTicketType = _mapper.Map<TicketTypeDto>(await _unitOfWork.TicketTypeRepository.UpdateAsync(existingTicketType));

                return updatedTicketType;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing with database.");
            }

        }

    
    }
}
