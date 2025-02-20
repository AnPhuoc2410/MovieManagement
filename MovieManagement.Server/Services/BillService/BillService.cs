using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.BillService
{
    public class BillService : IBillService
    {
        private readonly IUnitOfWork _unitOfWork;
        public BillService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Bill>> GetAllBillsAsync()
        {
            return await _unitOfWork.BillRepository.GetAllAsync();
        }
        public async Task<Bill> GetBillAsync(Guid billId)
        {
            return await _unitOfWork.BillRepository.GetByIdAsync(billId);
        }
        public async Task<Bill> CreateBillAsync(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, Bill bill)
        {
            var newBill = new Bill
            {
                CreatedDate = bill.CreatedDate,
                Point = bill.Point,
                TotalTicket = bill.TotalTicket,
                Amount = bill.Amount,
                MovieId = movieId,
                Showtime = bill.Showtime,
                MemberId = memberId,
                EmployeeId = employeeId,
                PromotionId = promotionId,
                Status = bill.Status,
            };
            return await _unitOfWork.BillRepository.CreateAsync(newBill);
        }
        public async Task<Bill> UpdateBillAsync(Guid billId, Bill bill)
        {
            var updateBill = await _unitOfWork.BillRepository.GetByIdAsync(billId);

            updateBill.CreatedDate = bill.CreatedDate;
            updateBill.Point = bill.Point;
            updateBill.TotalTicket = bill.TotalTicket;
            updateBill.Amount = bill.Amount;
            updateBill.MovieId = bill.MovieId;
            updateBill.Showtime = bill.Showtime;
            updateBill.MemberId = bill.MemberId;
            updateBill.EmployeeId = bill.EmployeeId;
            updateBill.PromotionId = bill.PromotionId;
            updateBill.Status = bill.Status;

            return await _unitOfWork.BillRepository.UpdateAsync(updateBill);
        }
        public async Task<bool> DeleteBillAsync(Guid billId)
        {
            return await _unitOfWork.BillRepository.DeleteAsync(billId);
        }
    }
}
