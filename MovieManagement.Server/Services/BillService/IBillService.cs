using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.BillService
{
    public interface IBillService
    {
        public Task<IEnumerable<BillDto>> GetAllAsync();
        public Task<IEnumerable<BillDto>> GetPageAsync(int page, int pageSize);
        public Task<BillDto> GetByIdAsync(Guid billId);
        public Task<BillDto> CreateAsync(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto);
        public Task<BillDto> UpdateAsync(Guid billId, BillDto billDto);
        public Task<bool> DeleteAsync(Guid billId);
    }
}
