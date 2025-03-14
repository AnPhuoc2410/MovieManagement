using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class SeatTypeRepository : GenericRepository<SeatType>, ISeatTypeRepository
    {
        public SeatTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
