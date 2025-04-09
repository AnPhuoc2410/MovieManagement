using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface ITicketDetailRepository : IGenericRepository<TicketDetail>
    {
        Task<List<TicketDetail>> GetTicketByBillIdAsync(Guid billId);
        Task<List<TicketDetail>> GetTicketByShowTimeId(Guid showTimeId);
        Task<TicketDetail> GetTicketByIdAndVersion(Guid id, byte[] version);
        Task<List<TicketDetail>> GetRemainingsTickets();
        Task<List<PurchasedTicketResponse>> GetPurchasedTicketsByBillId(Guid billId);

        List<TicketDetail> GetTicketByShowTimeIdV2(Guid showTimeId);
        Task<TicketDetail> GetTicketInfo(Guid Id);
        Task<long> TotalTicketSold();
        Task<List<long>> TicketDailyLast30Days();
    }
}
