using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.BillService
{
    public interface IBillService
    {
        public Task<IEnumerable<Bill>> GetAllBillsAsync();
        public Task<Bill> GetBillAsync(Guid billId);
        public Task<Bill> CreateBill(Guid movieId, Guid memberId, Guid employeeId, Guid promotionId, BillDto billDto);
        public Task<Bill> UpdateBillAsync(Guid billId, BillDto billDto);
        public Task<bool> DeleteBillAsync(Guid billId);
    }
}
