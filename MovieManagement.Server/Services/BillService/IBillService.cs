using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.BillService
{
    public interface IBillService
    {
        public Task<IEnumerable<BillDto>> GetAllBillsAsync();
        public Task<IEnumerable<BillDto>> GetPageAsync(int page, int pageSize);
        public Task<BillDto> GetBillByIdAsync(Guid billId);
        public Task<BillDto> CreateBillAsync(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto);
        public Task<BillDto> UpdateBillAsync(Guid billId, BillDto billDto);
        public Task<bool> DeleteBillAsync(Guid billId);
    }
}
