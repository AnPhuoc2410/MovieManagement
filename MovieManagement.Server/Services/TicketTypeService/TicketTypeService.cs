using AutoMapper;
using Azure;
using MovieManagement.Server.Data;
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

        public async Task<ResponseDto> CreateTicketType(TicketTypeDto ticketType)
        {
            var response = new ResponseDto();
            var newTicketType = new TicketType
            {
                Consumer = ticketType.Consumer,
                DayOfWeek = ticketType.DayOfWeek, 
                Hours = ticketType.Hours,
                Price = ticketType.Price,
                Version = ticketType.Version,
            };
            var createdTicketType = _mapper.Map<TicketTypeDto>(await _unitOfWork.TicketTypeRepository.CreateAsync(newTicketType));

            response.Success = true;
            response.Message = "TicketType created successfully!";
            response.StatusCode = StatusCodes.Status200OK;
            response.Data = createdTicketType;
            return response;

        }

        public async Task<bool> DeleteTicketType(Guid ticketId)
        => await _unitOfWork.TicketTypeRepository.DeleteAsync(ticketId);

        public async Task<ResponseDto> GetAllTicketType()
        {
            ResponseDto response = new ResponseDto();

            var TicketTypes = _mapper.Map<List<TicketTypeDto>>(await _unitOfWork.TicketTypeRepository.GetAllAsync());
    
            if (TicketTypes == null)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.Success = false;
                response.Message = "TicketTypes are not found!";
                return response;
            }

            response.StatusCode = StatusCodes.Status200OK;
            response.Success = true;
            response.Message = "Successfully!";
            response.Data = TicketTypes;
            return response;
        }

        public async Task<ResponseDto> GetTicketType(Guid ticketId)
        {
            var response = new ResponseDto();
            var ticket = await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId);

            //Checking existing if not return.
            if (ticket == null)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.Success = false;
                response.Message = "TicketType not found!";
                return response;
            }

            //Return after found the TicketType
            response.StatusCode = StatusCodes.Status200OK;
            response.Success = true;
            response.Message = "TicketType founded!";
            response.Data = _mapper.Map<TicketTypeDto>(ticket);
            return response;
        }

        public async Task<ResponseDto> UpdateTicketType(Guid ticketId, TicketTypeDto ticketType)
        {
            var response = new ResponseDto();
            var existingTicketType = await _unitOfWork.TicketTypeRepository.GetByIdAsync(ticketId);

            //Checking exist if not return.
            if(existingTicketType == null)
            {
                response.StatusCode = StatusCodes.Status404NotFound;
                response.Success = false;
                response.Message = "TicketType not found!";
                return response;
            }
            //Update Existing TicketType here:
            existingTicketType.Hours = ticketType.Hours;
            existingTicketType.DayOfWeek = ticketType.DayOfWeek;    
            existingTicketType.Price = ticketType.Price;
            existingTicketType.Version = ticketType.Version;
            existingTicketType.Consumer = ticketType.Consumer;
            
            var updateTicketType = await _unitOfWork.TicketTypeRepository.UpdateAsync(existingTicketType);

            //Return if true
            response.StatusCode = StatusCodes.Status200OK;
            response.Success = true;
            response.Message = "TicketType founded!";
            response.Data = _mapper.Map<TicketTypeDto>(updateTicketType);
            return response;
        }

    
    }
}
