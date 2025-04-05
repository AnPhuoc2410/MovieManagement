
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using System.Linq;
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
            if(id == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticketDetails == null)
                throw new NotFoundException("Ticket not found");
            return _mapper.Map<TicketDetailDto>(ticketDetails);
        }

        public async Task<IEnumerable<TicketDetailDto>> GetTicketDetailPageAsync(int page, int pageSize)
        {
            if(page < 0 || pageSize < 1)
                throw new BadRequestException("Page and PageSize is invalid");
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
            if(id == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
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
            if(id == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var ticketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
            if (ticketDetail == null)
                throw new NotFoundException("Ticket detail not found!");
            return await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<TicketDetailResponseModel>> GetTicketByShowTimeId(Guid showTimeId)
        {
            if(showTimeId == Guid.Empty)
                throw new BadRequestException("ShowTimeId is invalid!");
            var ticketDetails = await _unitOfWork.TicketDetailRepository.GetTicketByShowTimeId(showTimeId) ?? throw new NotFoundException("Ticket details not found!");
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

            //var standardType = ticketDetails.Where(t => t.Seat.SeatType.SeatSize == 1).ToList();
            //if (standardType != null || standardType.Any())
            //{
                var isBeside = CheckBeside(ticketDetails);
                if (isBeside == false)
                    throw new BadRequestException("Seats are not together in the same row.");
            //}

            var specialType = ticketDetails.Where(t => t.Seat.SeatType.SeatSize >= 2).ToList();
            if (specialType.Count != 0)
            {
                var isTogether = CheckGroupedSeats(specialType);
                if (isTogether == false)
                    throw new BadRequestException("Seats are not beside in the same row.");
            }

            var checker = await _unitOfWork.TicketDetailRepository.SaveAsync();
            return _mapper.Map<IEnumerable<TicketDetailResponseModel>>(ticketDetails);
        }

        private bool CheckGroupedSeats(List<TicketDetail> ticketDetails)
        {

            var showTimeId = ticketDetails.First().ShowTimeId;

            var ticketPos = ticketDetails
                .Where(t => t != null && t.Seat != null)
                .Select(t => new Seat
                {
                    AtRow = t.Seat.AtRow,
                    AtColumn = t.Seat.AtColumn,
                    SeatType = t.Seat.SeatType
                }).ToList();

            var ticket = _unitOfWork.TicketDetailRepository.GetTicketByShowTimeIdV2(showTimeId);

            var seats = ticket
                .Where(t => t.Seat != null)
                .Select(t => new Seat
                {
                    AtRow = t.Seat.AtRow,
                    AtColumn = t.Seat.AtColumn,
                    SeatType = t.Seat.SeatType
                }).ToList();

            var rowsWithGroupedSeats = seats
                .Where(s => s.SeatType.SeatSize > 1)
                .GroupBy(s => s.AtRow)
                .ToList();

            bool checker = true;

            foreach (var row in rowsWithGroupedSeats)
            {
                var selectedSeatsInRow = ticketPos.Where(t => t.AtRow == row.Key).OrderBy(t => t.AtColumn).ToList();
                var seatsInRow = row.OrderBy(s => s.AtColumn).ToList();

                int pos = 0;

                for (int i = 0; i < seatsInRow.Count; i++)
                {
                    var seatType = seatsInRow[i].SeatType;
                    var seatTypeSize = seatType.SeatSize.Value;
                    int flag = 0;
                    if (seatTypeSize > 1)
                    {

                        var selectedGroup = selectedSeatsInRow.Skip(pos).Take(seatTypeSize).ToList();

                        if (selectedGroup.Count < seatTypeSize)
                            break;

                        var group = seatsInRow.Skip(i).Take(seatTypeSize).ToList();

                        foreach (var seat in group)
                        {
                            if (!selectedGroup.Any(s => s.AtColumn == seat.AtColumn))
                            {
                                flag++;
                            }
                        }

                        if (flag == seatTypeSize)
                        {
                            i++;
                            continue;
                        }
                            

                        if (group.Count < seatTypeSize || group.Any(s => s.SeatType.SeatSize != seatTypeSize))
                        {
                            checker = false;
                        }


                        if (selectedGroup.Count < seatTypeSize)
                            break;
                        
                        if (selectedGroup.Count != seatTypeSize || 
                            selectedGroup.Any(s => s.SeatType.SeatSize != seatTypeSize)
                            )
                        {
                            checker = false;
                            
                        }

                        foreach (var seat in group)
                        {
                            if (!selectedGroup.Any(s => s.AtColumn == seat.AtColumn))
                            {
                                checker = false;
                            }
                        }


                        i += seatTypeSize - 1; // Skip the checked seats
                        pos += seatTypeSize;
                    }

                }
            }

            return checker;
        }




        private bool CheckBeside(List<TicketDetail> ticketDetails)
        {

            var showTimeId = ticketDetails.First().ShowTimeId;

            var ticketPos = ticketDetails
                .Where(t => t != null && t.Seat != null)
                .Select(t => new Seat
                {
                    AtRow = t.Seat.AtRow,
                    AtColumn = t.Seat.AtColumn,
                    SeatType = t.Seat.SeatType
                }).ToList();

            var ticket = _unitOfWork.TicketDetailRepository.GetTicketByShowTimeIdV2(showTimeId);

            var seats = ticket
                .Where(t => t.Seat != null)
                .Select(t => new Seat
                {
                    AtRow = t.Seat.AtRow,
                    AtColumn = t.Seat.AtColumn,
                    SeatType = t.Seat.SeatType
                }).ToList();

            foreach (var seat in seats)
            {
                var selectedSeatsInRow = ticketPos.Where(t => t.AtRow == seat.AtRow).OrderBy(t => t.AtColumn).ToList();
                for (int i = 0; i < selectedSeatsInRow.Count - 1; i++)
                {
                    if (selectedSeatsInRow[i + 1].AtColumn != selectedSeatsInRow[i].AtColumn + 1)
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public async Task<IEnumerable<TicketDetailResponseModel>> ChangeStatusTicketDetailAsync(List<TicketDetailRequest> ticketRequests, TicketStatus status)
        {
            List<TicketDetail> ticketDetails = new List<TicketDetail>();
            foreach (var request in ticketRequests)
            {
                var ticketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(request.TicketId);
                if (ticketDetail == null)
                    throw new NotFoundException("Ticket detail not found!");

                ticketDetail.Status = status;
                _unitOfWork.TicketDetailRepository.PrepareUpdate(ticketDetail);
                ticketDetails.Add(ticketDetail);
            }

            var checker = await _unitOfWork.TicketDetailRepository.SaveAsync();
            if (checker != ticketRequests.Count)
                throw new DbUpdateException("Fail to update ticket detail status.");

            return _mapper.Map<IEnumerable<TicketDetailResponseModel>>(ticketDetails);
        }

        public async Task<bool> DeleteRemainingTicket(Guid showTimeId)
        {
            if (showTimeId == Guid.Empty)
                throw new BadRequestException("ShowTimeId is invalid!");
            var ticketDetails = (await _unitOfWork.TicketDetailRepository.GetTicketByShowTimeId(showTimeId)).Where(t => t.Status == TicketStatus.Created)
                ?? throw new NotFoundException("Ticket details not found!");
            foreach (var t in ticketDetails)
            {
                _unitOfWork.TicketDetailRepository.PrepareRemove(t);
            }
            return await _unitOfWork.TicketDetailRepository.SaveAsync() == ticketDetails.Count();
        }

        public bool PurchasedTicket(List<Guid> list, Guid billId, Guid userId)
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

            var user = _unitOfWork.UserRepository.GetById(userId) ??
                throw new NotFoundException("User not found!");

            var bill = _unitOfWork.BillRepository.GetById(billId) ??
                throw new NotFoundException("Bill not found!");

            user.Point += bill.Point;

            _unitOfWork.UserRepository.PrepareUpdate(user);

            var checker = _unitOfWork.Complete();

            //Check this line later cause im being lazy
            return checker > 0;
        }


        public async Task<IEnumerable<PurchasedTicketResponse>> GetPurchasedTicketsByBillId(Guid billId)
        {
            if (billId == null)
                throw new BadRequestException("PaymentId is invalid!");
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
