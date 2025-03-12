
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public class TicketDetailService : ITicketDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TicketDetailService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<TicketDetailDto> CreateTicketDetailAsync(TicketDetailDto ticketDetail)
        {
            try
            {
                var newTicketDetail = _mapper.Map<TicketDetail>(ticketDetail);
                var createdTicketDetail = await _unitOfWork.TicketDetailRepository.CreateAsync(newTicketDetail);
                if (createdTicketDetail == null)
                    throw new Exception("Failed to create ticket detail.");
                return _mapper.Map<TicketDetailDto>(createdTicketDetail);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into the database.", ex);
            }
        }

        public async Task<TicketDetailDto> GetTicketDetailByIdAsync(Guid id)
        {
            try
            {
                var ticketDetails = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
                if (ticketDetails == null)
                    throw new NotFoundException("Ticket not found");
                return _mapper.Map<TicketDetailDto>(ticketDetails);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<TicketDetailDto>> GetTicketDetailPageAsync(int page, int pageSize)
        {
            try
            {
                var ticketDetails = await _unitOfWork.TicketDetailRepository.GetPageAsync(page, pageSize);
                if (ticketDetails == null)
                    throw new NotFoundException("Ticket details not found!");
                return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<TicketDetailDto>> GetAllTicketDetailsAsync()
        {
            try
            {
                var ticketDetails = await _unitOfWork.TicketDetailRepository.GetAllAsync();
                if (ticketDetails == null)
                    throw new NotFoundException("No ticket details found!");
                return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<TicketDetailDto> UpdateTicketDetailAsync(Guid id, TicketDetailDto ticketDetail)
        {
            try
            {
                var existingTicketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
                if (existingTicketDetail == null)
                    throw new NotFoundException("Ticket detail not found");
                var updatedTicketDetail = await _unitOfWork.TicketDetailRepository.UpdateAsync(_mapper.Map<TicketDetail>(ticketDetail));
                if (updatedTicketDetail == null)
                    throw new DbUpdateException("Fail to update ticket detail.");

                return _mapper.Map<TicketDetailDto>(updatedTicketDetail);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<bool> DeleteTicketDetailAsync(Guid id)
        {
            try
            {
                var ticketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
                if (ticketDetail == null)
                    throw new NotFoundException("Ticket detail not found!");
                return await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

    }
}
