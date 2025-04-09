using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IBillRepository : IGenericRepository<Bill>
    {
        Task<Bill> GetByIdAsync(Guid billId);
        Bill GetById(Guid billId);
        Task<bool> DeleteAsync(Guid billId);
        Task<List<TicketBillResponse>> GetPurchasedTicketsForBill(Guid billId);
        Task<List<RevenueResponse.DailyStatistics>> GetDailyStatisticsAsync();

        Task<List<Bill>> GetTransactionHistoryByUserId(Guid userId);
        Task<Dictionary<DateOnly, decimal>> GetRevenueByDate();
    }
}
