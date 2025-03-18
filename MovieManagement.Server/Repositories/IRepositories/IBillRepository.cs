using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IBillRepository : IGenericRepository<Bill>
    {
        Task<List<PurchasedTicketDto>> GetPurchasedTickets(Guid userId);
        Task<Bill> GetByIdAsync(long billId);
        Bill GetById(long billId);
        Task<bool> DeleteAsync(long billId);
    }
}
