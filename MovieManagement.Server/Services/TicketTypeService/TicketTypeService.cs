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

        public async Task<TicketTypeDto> CreateTicketType(TicketTypeDto ticketType)
        {
            var newTicketType = new TicketType
            {
                Consumer = ticketType.Consumer,
                DayOfWeek = ticketType.DayOfWeek, 
                Hours = ticketType.Hours,
                Price = ticketType.Price,
                Version = ticketType.Version,
            };

            try
            {
                var createdTicketType = _mapper.Map<TicketTypeDto>(await _unitOfWork.TicketTypeRepository.CreateAsync(newTicketType));

                return createdTicketType;

            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while processing into Database", ex);
            }


        }

        public async Task<bool> DeleteTicketType(Guid ticketId)
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

        public async Task<IEnumerable<TicketTypeDto>> GetAllTicketType()
        {
            try
            {
                var TicketTypes = _mapper.Map<List<TicketTypeDto>>(await _unitOfWork.TicketTypeRepository.GetAllAsync());

                if (TicketTypes == null)
                {
                    //Thrown exception here.
                    throw new NotFoundException("TicketType does not found!");
                }
                return TicketTypes;
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<TicketTypeDto> GetTicketType(Guid ticketId)
        {

            try
            {
                var ticket = _mapper.Map<TicketTypeDto>(await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId));

                //Checking existing if not return.
                if (ticket == null)
                {
                    //Thrown exception here.
                    throw new NotFoundException("TicketType does not found!");
                }

                return ticket;
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<TicketTypeDto> UpdateTicketType(Guid ticketId, TicketTypeDto ticketType)
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

                var updateTicketType = _mapper.Map<TicketTypeDto>(await _unitOfWork.TicketTypeRepository.UpdateAsync(existingTicketType));

                return updateTicketType;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing with database.");
            }

        }

    
    }
}
