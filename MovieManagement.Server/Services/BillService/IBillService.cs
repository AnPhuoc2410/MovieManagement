using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.BillService
{
    public interface IBillService
    {
        public Task<IEnumerable<BillDto>> GetAllBillsAsync();
        public Task<IEnumerable<BillDto>> GetBillPageAsync(int page, int pageSize);
        public Task<BillDto> GetBillByIdAsync(long billId);
        public Task<BillDto> CreateBillAsync(Guid userId, BillRequest billRequest, long paymentId);
        public Task<BillDto> UpdateBillAsync(long billId, BillEnum.BillStatus billStatus);
        public BillDto UpdateBill(long billId, BillEnum.BillStatus billStatus);
        public Task<bool> DeleteBillAsync(long billId);
        public Task<IEnumerable<PurchasedTicketDto>> GetPurchasedTicketsAsync(Guid userId); 
    }
}
