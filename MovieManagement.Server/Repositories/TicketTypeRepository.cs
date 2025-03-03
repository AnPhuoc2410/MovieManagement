using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class TicketTypeRepository : GenericRepository<TicketType>, ITicketTypeRepository
    {
        public TicketTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
