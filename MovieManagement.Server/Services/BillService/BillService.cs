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
        public async Task<IEnumerable<BillDto>> GetAllAsync()
        {
            var bills = await _unitOfWork.BillRepository.GetAllAsync();
            return _mapper.Map<List<BillDto>>(bills);
        }
        public async Task<IEnumerable<BillDto>> GetPageAsync(int page, int sizePage)
        {
            var bills = await _unitOfWork.BillRepository.GetPageAsync(page, sizePage);
            return _mapper.Map<List<BillDto>>(bills);
        }
        public async Task<BillDto> GetByIdAsync(Guid billId)
        {
            var bill = await _unitOfWork.BillRepository.GetByIdAsync(billId);
            return _mapper.Map<BillDto>(bill);
        }
        public async Task<BillDto> CreateAsync(Guid userId, BillDto billDto)
        {
            var newBill = new Bill
            {
                CreatedDate = billDto.CreatedDate,
                Point = billDto.Point,
                TotalTicket = billDto.TotalTicket,
                Amount = billDto.Amount,
                UserId = userId,
                PromotionId = billDto.PromotionId,
                Status = billDto.Status,
            };
            var bill = await _unitOfWork.BillRepository.CreateAsync(newBill);
            return _mapper.Map<BillDto>(bill);
        }
        public async Task<BillDto> UpdateAsync(Guid billId, BillDto billDto)
        {
            var updateBill = await _unitOfWork.BillRepository.GetByIdAsync(billId);

            updateBill.CreatedDate = billDto.CreatedDate;
            updateBill.Point = billDto.Point;
            updateBill.TotalTicket = billDto.TotalTicket;
            updateBill.Amount = billDto.Amount;
            updateBill.UserId = billDto.UserId;
            updateBill.PromotionId = billDto.PromotionId;
            updateBill.Status = billDto.Status;

            var bill = await _unitOfWork.BillRepository.UpdateAsync(updateBill);
            return _mapper.Map<BillDto>(bill);
        }
        public async Task<bool> DeleteAsync(Guid billId)
        {
            return await _unitOfWork.BillRepository.DeleteAsync(billId);
        }
    }
}
