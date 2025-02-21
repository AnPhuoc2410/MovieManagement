
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public class TicketDetailService : ITicketDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TicketDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TicketDetail> CreateTicketDetail(TicketDetail ticketDetail)
        {
            var newTicketDetail = new TicketDetail()
            {
                BillId = ticketDetail.BillId,
                SeatId = ticketDetail.SeatId,
            };

            var createdTicketDetail = await _unitOfWork.TicketDetailRepository.CreateAsync(newTicketDetail);
            return createdTicketDetail;
        }
        public async Task<TicketDetail> GetTicketDetail(Guid id)
        {
            var ticket = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticket == null)
            {
                throw new Exception("Ticket not found");
            }
            return ticket;
        }

        public async Task<IEnumerable<TicketDetail>> GetAllTicketDetails()
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetAllAsync();
            return ticketDetails;
        }

        public async Task<TicketDetail> UpdateTicketDetail(Guid id, TicketDetail ticketDetail)
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
            return updateTicketDetail;
        }

        public async Task<bool> DeleteTicketDetail(Guid id)
        {
            var result = await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
            return result;
        }
    }
}
