using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.RequestModel;

namespace MovieManagement.Server.Services.BillService
{
    public class BillService : IBillService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public BillService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<BillDto>> GetAllBillsAsync()
        {
            try
            {
                var bills = _mapper.Map<List<BillDto>>(await _unitOfWork.BillRepository.GetAllAsync());
                if (bills == null)
                {
                    throw new NotFoundException("Movie does not found!");
                }
                return bills;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
        public async Task<IEnumerable<BillDto>> GetBillPageAsync(int page, int sizePage)
        {
            var bills = await _unitOfWork.BillRepository.GetPageAsync(page, sizePage);
            return _mapper.Map<List<BillDto>>(bills);
        }
        public async Task<BillDto> GetBillByIdAsync(Guid billId)
        {
            try
            {
                var bill = _mapper.Map<BillDto>(await _unitOfWork.BillRepository.GetByIdAsync(billId));
                if (bill == null)
                {
                    throw new NotFoundException("Bill not found");
                }
                return bill;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
        public async Task<BillDto> CreateBillAsync(Guid userId, BillRequest billRequest)
        {
            try
            {
                //Checking user is existing
                var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
                if (user == null)
                    throw new NotFoundException("User cannot found!");

                //Calculator ticket total
                var bill = _mapper.Map<Bill>(billRequest);
                bill.CreatedDate = DateTime.Now;
                bill.UserId = userId;
                bill.Status = BillEnum.BillStatus.Pending;
                bill.Point = bill.TotalTicket;

                var createdBill = _mapper.Map<BillDto>(await _unitOfWork.BillRepository.CreateAsync(bill));
                if (createdBill == null)
                    throw new Exception("Failed to create bill.");
                return createdBill;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into Database", ex);
            }
        }
        public async Task<BillDto> UpdateBillAsync(Guid billId, BillRequest billRequest)
        {
            var existingBill = await _unitOfWork.BillRepository.GetByIdAsync(billId);
            if (existingBill == null)
                throw new NotFoundException("Bill cannot found!");

            existingBill = _mapper.Map(billRequest, existingBill);
            var updatedBill = await _unitOfWork.BillRepository.UpdateAsync(existingBill);
            if (updatedBill == null)
                throw new DbUpdateException("Bill cannot update!");
            return _mapper.Map<BillDto>(updatedBill);

        }
        public async Task<bool> DeleteBillAsync(Guid billId)
        {
            try
            {
                var bill = _unitOfWork.BillRepository.GetByIdAsync(billId);
                if (bill == null)
                    throw new NotFoundException("Bill cannot found!");
                return await _unitOfWork.BillRepository.DeleteAsync(billId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
        public async Task<IEnumerable<PurchasedTicketDto>> GetPurchasedTicketsAsync(Guid userId)
        {
            try
            {
                var bill = _unitOfWork.BillRepository.GetPurchasedTickets(userId);
                if (bill == null)
                    throw new NotFoundException("Bill of user is not found!");
                return (IEnumerable<PurchasedTicketDto>)bill;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Couldn't access into database due to systems error.", ex);
            }
        }
    }
}
