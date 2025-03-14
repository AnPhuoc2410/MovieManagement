using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class RoomRepository : GenericRepository<Room>, IRoomRepository
    {

        private readonly AppDbContext _context;

        public RoomRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Room> GetRoomInfo(Guid roomId)
        {
            var rooms = await _context.Rooms
                .Include(r => r.Seats.OrderBy(s => s.AtColumn))
                    .ThenInclude(s => s.SeatType)
                .FirstAsync(r => r.RoomId == roomId);
            rooms.Seats = rooms.Seats.OrderBy(s => s.AtRow).ToList();
            return rooms;
        }


    }
}
