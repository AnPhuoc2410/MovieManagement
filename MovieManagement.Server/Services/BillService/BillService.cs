using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

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
            var bills = await _unitOfWork.BillRepository.GetAllAsync();
            return _mapper.Map<List<BillDto>>(bills);
        }
        public async Task<IEnumerable<BillDto>> GetBillPageAsync(int page, int sizePage)
        {
            var bills = await _unitOfWork.BillRepository.GetPageAsync(page, sizePage);
            return _mapper.Map<List<BillDto>>(bills);
        }
        public async Task<BillDto> GetBillByIdAsync(Guid billId)
        {
            var bill = await _unitOfWork.BillRepository.GetByIdAsync(billId);
            return _mapper.Map<BillDto>(bill);
        }
        public async Task<BillDto> CreateBillAsync(Guid userId, BillDto billDto)
        {
            billDto.BillId = Guid.NewGuid();
            billDto.UserId = userId;
            var newBill = _mapper.Map<Bill>(billDto);
            newBill.PromotionId = null;
            var createdBill = await _unitOfWork.BillRepository.CreateAsync(newBill);
            return _mapper.Map<BillDto>(createdBill);
        }
        public async Task<BillDto> UpdateBillAsync(Guid billId, BillDto billDto)
        {
            var existingBill = await _unitOfWork.BillRepository.GetByIdAsync(billId);

            existingBill.CreatedDate = billDto.CreatedDate;
            existingBill.Point = billDto.Point;
            existingBill.TotalTicket = billDto.TotalTicket;
            existingBill.Amount = billDto.Amount;
            existingBill.UserId = billDto.UserId;
            existingBill.PromotionId = billDto.PromotionId;
            existingBill.Status = billDto.Status;

            var updatedBill = await _unitOfWork.BillRepository.UpdateAsync(existingBill);
            return _mapper.Map<BillDto>(updatedBill);
        }
        public async Task<bool> DeleteBillAsync(Guid billId)
        {
            return await _unitOfWork.BillRepository.DeleteAsync(billId);
        }
        public async Task<IEnumerable<PurchasedTicketDto>> GetPurchasedTicketsAsync(Guid userId)
        {
            return await _unitOfWork.BillRepository.GetPurchasedTickets(userId);
        }
    }
}
