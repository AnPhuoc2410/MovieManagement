using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IBillRepository : IGenericRepository<Bill>
    {
        Task<Bill> GetByIdAsync(long billId);
        Bill GetById(long billId);
        Task<bool> DeleteAsync(long billId);
        Task<List<TicketBillResponse>> GetPurchasedTicketsForBill(long billId);
        Task<List<RevenueResponse.DailyStatistics>> GetDailyStatisticsAsync();
    }
}
