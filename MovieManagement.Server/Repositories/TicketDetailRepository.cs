using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class TicketDetailRepository : GenericRepository<TicketDetail>, ITicketDetailRepository
    {
        public TicketDetailRepository(AppDbContext context) : base(context)
        {
        }
    }
}
