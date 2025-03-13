using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface ITicketDetailRepository : IGenericRepository<TicketDetail>
    {
        Task<List<TicketDetail>> GetTicketByShowTimeId(Guid showTimeId);
        Task<TicketDetail> GetTicketByIdAndVersion(Guid id, byte[] version);
    }
}
