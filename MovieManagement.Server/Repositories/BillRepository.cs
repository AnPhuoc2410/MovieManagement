using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class BillRepository : GenericRepository<Bill>, IBillRepository
    {
        private readonly AppDbContext _context;
        public BillRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> DeleteAsync(long billId)
        {
            var entity = await GetByIdAsync(billId);
            if (entity == null) return false;
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Bill> GetByIdAsync(long billId)
        {
            return await _context.Bills.FindAsync(billId);
        }

        public async Task<List<PurchasedTicketDto>> GetPurchasedTickets(Guid userId)
        {
            return await _context.Bills
                .Where(b => b.UserId == userId)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.ShowTime)
                        .ThenInclude(st => st.Room)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.ShowTime)
                        .ThenInclude(st => st.Movie)
                .SelectMany(b => b.TicketDetails.Select(td => new PurchasedTicketDto
                {
                    MovieName = td.ShowTime.Movie.MovieName,
                    CreateDate = b.CreatedDate,
                    StartDay = td.ShowTime.StartTime.ToShortTimeString(),
                    Showtime = td.ShowTime.StartTime.ToShortTimeString(),
                    RoomName = td.ShowTime.Room.RoomName,
                    Status = b.Status
                }))
                .ToListAsync();
        }
    }
}
