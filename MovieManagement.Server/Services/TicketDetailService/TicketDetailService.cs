
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.TicketEnum;

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
            newTicketDetail.TicketId = Guid.NewGuid();
            newTicketDetail.Version = new byte[8];
            var createdTicketDetail = await _unitOfWork.TicketDetailRepository.CreateAsync(newTicketDetail);
            if (createdTicketDetail == null)
                throw new Exception("Failed to create ticket detail.");
            return _mapper.Map<TicketDetailDto>(createdTicketDetail);
        }

        public async Task<TicketDetailDto> GetTicketDetailByIdAsync(Guid id)
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticketDetails == null)
                throw new NotFoundException("Ticket not found");
            return _mapper.Map<TicketDetailDto>(ticketDetails);
        }

        public async Task<IEnumerable<TicketDetailDto>> GetTicketDetailPageAsync(int page, int pageSize)
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetPageAsync(page, pageSize);
            if (ticketDetails == null)
                throw new NotFoundException("Ticket details not found!");
            return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
        }

        public async Task<IEnumerable<TicketDetailDto>> GetAllTicketDetailsAsync()
        {
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetAllAsync();
            if (ticketDetails == null)
                throw new NotFoundException("No ticket details found!");
            return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
        }

        public async Task<TicketDetailDto> UpdateTicketDetailAsync(Guid id, TicketDetailDto ticketDetail)
        {
            var existingTicketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (existingTicketDetail == null)
                throw new NotFoundException("Ticket detail not found");
            var updatedTicketDetail = await _unitOfWork.TicketDetailRepository.UpdateAsync(_mapper.Map<TicketDetail>(ticketDetail));
            if (updatedTicketDetail == null)
                throw new DbUpdateException("Fail to update ticket detail.");

            return _mapper.Map<TicketDetailDto>(updatedTicketDetail);
        }

        public async Task<bool> DeleteTicketDetailAsync(Guid id)
        {
            var ticketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticketDetail == null)
                throw new NotFoundException("Ticket detail not found!");
            return await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<TicketDetailResponseModel>> GetTicketByShowTimeId(Guid showTimeId)
        {

            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetTicketByShowTimeId(showTimeId);
            if (ticketDetails == null)
                throw new NotFoundException("Ticket details not found!");
            return _mapper.Map<IEnumerable<TicketDetailResponseModel>>(ticketDetails);
        }

        public async Task<IEnumerable<TicketDetailResponseModel>> UpdateTicketToPending(List<TicketDetailRequest> Tickets)
        {
            List<TicketDetail> ticketDetails = new List<TicketDetail>();
            foreach (var t in Tickets)
            {
                var current = await _unitOfWork.TicketDetailRepository.GetTicketByIdAndVersion(t.TicketId, t.Version)
                ?? throw new NotFoundException("Version conflicted.");
                if (current.ShowTime.EndTime.CompareTo(DateTime.Now) < 0)
                    throw new BadRequestException("Show time is over.");
                if (current.Status != TicketStatus.Created)
                    throw new BadRequestException($"Ticket is on other status.");
                current.Status = TicketStatus.Pending;
                _unitOfWork.TicketDetailRepository.PrepareUpdate(current);
                ticketDetails.Add(current);
            }

            var checker = await _unitOfWork.TicketDetailRepository.SaveAsync();
            if (checker != Tickets.Count())
                throw new DbUpdateException("Fail to update ticket detail.");
            return _mapper.Map<IEnumerable<TicketDetailResponseModel>>(ticketDetails);
        }


        public async Task<TicketDetailResponseModel> ChangeStatusTicketDetailAsync(Guid ticketId, TicketStatus status)
        {
            var ticketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(ticketId);
            if (ticketDetail == null)
                throw new NotFoundException("Ticket detail not found!");

            ticketDetail.Status = status;
            var updatedTicketDetail = await _unitOfWork.TicketDetailRepository.UpdateAsync(ticketDetail);
            if (updatedTicketDetail == null)
                throw new DbUpdateException("Fail to update ticket detail status.");

            return _mapper.Map<TicketDetailResponseModel>(updatedTicketDetail);
        }

        public async Task<bool> DeleteRemainingTicket(Guid showTimeId)
        {
            var ticketDetails = (await _unitOfWork.TicketDetailRepository.GetTicketByShowTimeId(showTimeId)).Where(t => t.Status == TicketStatus.Created)
                ?? throw new NotFoundException("Ticket details not found!");
            foreach (var t in ticketDetails)
            {
                _unitOfWork.TicketDetailRepository.PrepareRemove(t);
            }
            return await _unitOfWork.TicketDetailRepository.SaveAsync() == ticketDetails.Count();
        }

        public bool PurchasedTicket(List<Guid> list, long billId)
        {

            foreach (var t in list)
            {
                var ticketDetail = _unitOfWork.TicketDetailRepository.GetById(t);
                if (ticketDetail == null)
                    throw new NotFoundException("Ticket detail not found!");
                if (ticketDetail.Status != TicketStatus.Pending)
                    throw new BadRequestException("Ticket is not pending.");
                ticketDetail.Status = TicketStatus.Paid;
                ticketDetail.BillId = billId;
                _unitOfWork.TicketDetailRepository.PrepareUpdate(ticketDetail);
            }
            var checker = _unitOfWork.TicketDetailRepository.Save();

            //Check this line later cause im being lazy
            return checker > 0;


        }


        public async Task<IEnumerable<PurchasedTicketResponse>> GetPurchasedTicketsByBillId(long billId)
        {
            if (billId == null)
                throw new BadRequestException("BillId is invalid!");
            var isExist = await _unitOfWork.BillRepository.GetByIdAsync(billId);
            if (isExist == null)
                throw new NotFoundException("Bill not found!");
            List<PurchasedTicketResponse> purchasedTicketResponses = await _unitOfWork.TicketDetailRepository.GetPurchasedTicketsByBillId(billId);
            if (purchasedTicketResponses == null)
                throw new NotFoundException("No purchased ticket found!");
            return purchasedTicketResponses;
        }

    }
}
