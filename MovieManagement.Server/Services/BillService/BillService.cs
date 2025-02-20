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
        public async Task<Bill> CreateBillAsync(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto)
        {
            var newBill = new Bill
            {
                CreatedDate = billDto.CreatedDate,
                Point = billDto.Point,
                TotalTicket = billDto.TotalTicket,
                Amount = billDto.Amount,
                MovieId = movieId,
                Showtime = billDto.Showtime,
                MemberId = memberId,
                EmployeeId = employeeId,
                PromotionId = promotionId,
                Status = billDto.Status,
            };
            return await _unitOfWork.BillRepository.CreateAsync(newBill);
        }
        public async Task<Bill> UpdateBillAsync(Guid billId, BillDto billDto)
        {
            var updateBill = await _unitOfWork.BillRepository.GetByIdAsync(billId);

            updateBill.CreatedDate = billDto.CreatedDate;
            updateBill.Point = billDto.Point;
            updateBill.TotalTicket = billDto.TotalTicket;
            updateBill.Amount = billDto.Amount;
            updateBill.MovieId = billDto.MovieId;
            updateBill.Showtime = billDto.Showtime;
            updateBill.MemberId = billDto.MemberId;
            updateBill.EmployeeId = billDto.EmployeeId;
            updateBill.PromotionId = billDto.PromotionId;
            updateBill.Status = billDto.Status;

            return await _unitOfWork.BillRepository.UpdateAsync(updateBill);
        }
        public async Task<bool> DeleteBillAsync(Guid billId)
        {
            return await _unitOfWork.BillRepository.DeleteAsync(billId);
        }
    }
}
