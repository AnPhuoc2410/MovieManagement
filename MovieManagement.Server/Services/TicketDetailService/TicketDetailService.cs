
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

        public async Task<TicketDetailDto> CreateTicketDetail(TicketDetailDto ticketDetail)
        {
            var newTicketDetail = new TicketDetail()
            {
                BillId = ticketDetail.BillId,
                SeatId = ticketDetail.SeatId,
                TicketTypeId = ticketDetail.TicketTypeId
            };

            var createdTicketDetail = await _unitOfWork.TicketDetailRepository.CreateAsync(newTicketDetail);
            return _mapper.Map<TicketDetailDto>(createdTicketDetail);
        }


        public async Task<TicketDetailDto> GetTicketDetail(Guid id)
        {
            var ticket = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticket == null)
            {
                throw new Exception("Ticket not found");
            }
            return _mapper.Map<TicketDetailDto>(ticket);
        }
        public async Task<IEnumerable<TicketDetailDto>> GetPageAsync(int page, int pageSize)
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<TicketDetailDto>>(ticketDetails);
        }

        public async Task<IEnumerable<TicketDetailDto>> GetAllTicketDetails()
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetAllAsync();
            return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
        }

        public async Task<TicketDetailDto> UpdateTicketDetail(Guid id, TicketDetailDto ticketDetail)
        {
            var existingTicketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync
                (id);
            if (existingTicketDetail == null)
            {
                throw new Exception("Promotion not found");
            }
            existingTicketDetail.BillId = ticketDetail.BillId;
            existingTicketDetail.SeatId = ticketDetail.SeatId;
            existingTicketDetail.SeatId = ticketDetail.SeatId;

            var updateTicketDetail = await _unitOfWork.TicketDetailRepository.UpdateAsync(existingTicketDetail);
            return _mapper.Map<TicketDetailDto>(updateTicketDetail);
        }




        public async Task<bool> DeleteTicketDetail(Guid id)
        {
            var result = await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
            return result;
        }




    }
}
