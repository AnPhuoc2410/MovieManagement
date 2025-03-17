using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.BillService
{
    public interface IBillService
    {
        public Task<IEnumerable<BillDto>> GetAllBillsAsync();
        public Task<IEnumerable<BillDto>> GetBillPageAsync(int page, int pageSize);
        public Task<BillDto> GetBillByIdAsync(Guid billId);
        public Task<BillDto> CreateBillAsync(Guid userId, BillRequest billRequest);
        public Task<BillDto> UpdateBillAsync(Guid billId, BillRequest billRequest);
        public Task<bool> DeleteBillAsync(Guid billId);
    }
}
