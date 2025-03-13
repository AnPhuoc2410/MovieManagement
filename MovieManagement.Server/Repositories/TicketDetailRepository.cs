using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class TicketDetailRepository : GenericRepository<TicketDetail>, ITicketDetailRepository
    {
        private readonly AppDbContext _context;

        public TicketDetailRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<TicketDetail>> GetTicketByShowTimeId(Guid showTimeId)
        {
            return await _context.TicketDetails
                .Where(td => td.ShowTimeId == showTimeId)
                .Include(td => td.Seat)
                    .ThenInclude(s => s.SeatType)
                .OrderBy(td => td.Seat.AtRow)
                .ThenBy(td => td.Seat.AtColumn)
                .ToListAsync();
        }

        public async Task<TicketDetail> GetTicketByIdAndVersion(Guid id, byte[] version)
        {
            return await _context.TicketDetails
                .FirstOrDefaultAsync(td => td.TicketId == id && td.Version == version);
        }


    }
}
