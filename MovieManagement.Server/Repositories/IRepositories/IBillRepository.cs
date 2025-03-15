using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IBillRepository : IGenericRepository<Bill>
    {
        Task<List<PurchasedTicketResponse>> GetPurchasedTickets(Guid userId);
        Task<List<TicketBillResponse>> GetPurchasedTicketsForBill(Guid billId);
    }
}
