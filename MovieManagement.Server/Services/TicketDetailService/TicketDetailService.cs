
using AutoMapper;
using MovieManagement.Server.Data;
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
            var newTicketDetail = _mapper.Map<TicketDetail>(ticketDetail);
            var createdTicketDetail = await _unitOfWork.TicketDetailRepository.CreateAsync(newTicketDetail);
            return _mapper.Map<TicketDetailDto>(createdTicketDetail);
        }


        public async Task<TicketDetailDto> GetTicketDetailByIdAsync(Guid id)
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticketDetails == null)
            {
                throw new Exception("Ticket not found");
            }
            return _mapper.Map<TicketDetailDto>(ticketDetails);
        }
        public async Task<IEnumerable<TicketDetailDto>> GetTicketDetailPageAsync(int page, int pageSize)
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<TicketDetailDto>>(ticketDetails);
        }

        public async Task<IEnumerable<TicketDetailDto>> GetAllTicketDetailsAsync()
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetAllAsync();
            return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
        }

        public async Task<TicketDetailDto> UpdateTicketDetailAsync(Guid id, TicketDetailDto ticketDetail)
        {
            var existingTicketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync
                (id);
            if (existingTicketDetail == null)
            {
                throw new Exception("Promotion not found");
            }
            existingTicketDetail.BillId = ticketDetail.BillId;
            existingTicketDetail.SeatId = ticketDetail.SeatId;

            var updatedTicketDetail = await _unitOfWork.TicketDetailRepository.UpdateAsync(existingTicketDetail);
            return _mapper.Map<TicketDetailDto>(updatedTicketDetail);
        }




        public async Task<bool> DeleteTicketDetailAsync(Guid id)
        {
            var result = await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
            return result;
        }




    }
}
