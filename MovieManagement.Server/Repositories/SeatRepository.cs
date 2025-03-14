using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class SeatRepository : GenericRepository<Seat>, ISeatRepository
    {

        private readonly AppDbContext _context;

        public SeatRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Seat>> GetByRoomIdAsync(Guid roomId)
        {
            var seats = await _context.Seats.Where(s => s.RoomId == roomId).ToListAsync();
            return seats;
        }



    }
}
