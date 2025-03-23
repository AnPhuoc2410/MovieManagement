using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories.IRepositories;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Repositories
{
    public class ShowtimeRepository : GenericRepository<ShowTime>, IShowtimeRepository
    {

        private readonly AppDbContext _context;

        public ShowtimeRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public Task<bool> CheckStartTimeAsync(DateTime startTime)
        {
            if (_context.Showtimes.Any(st => st.StartTime == startTime))
            {
                return Task.FromResult(false);
            }
            return Task.FromResult(true);
        }

        public async Task<List<ShowTime>> GetShowTimeByRoomIdAsync(Guid roomId)
        {
            var showTimes = await _context.Showtimes
                .Where(st => st.RoomId == roomId)
                .ToListAsync();
            return showTimes;
        }

        public async Task<List<ShowTime>> GetShowTimeFromDateToDate(Guid movieId, DateTime date1, DateTime date2)
        {
            var showTimes = await _context.Showtimes
                .Where(st => st.MovieId == movieId && st.StartTime.Date >= date1.Date && st.StartTime.Date <= date2.Date && st.StartTime.AddMinutes(15).CompareTo(DateTime.Now) > 0)
                .OrderBy(st => st.StartTime)
                .ToListAsync();
            return showTimes;
        }

        public async Task<List<ShowTime>> GetAllInfoAsync()
        {
            return await _context.Showtimes
                .Include(st => st.Movie)
                .Include(st => st.Room)
                    .ThenInclude(r => r.MovieTheater)
                .ToListAsync();
        }

            public async Task<TopShowtimeResponse.ShowtimeRevenue> GetTopShowtimeRevenues(DateTime time)
        {
            var showtimeTicketsSold = await _context.TicketDetails
                .Where(td => td.Status == TicketStatus.Paid && td.ShowTime.StartTime.Hour == time.Hour) // Chỉ lấy vé đã thanh toán
                .GroupBy(td => td.ShowTime.StartTime.Hour) // Nhóm theo giờ của suất chiếu
                .Select(g => new TopShowtimeResponse.ShowtimeRevenue
                {
                    TimeInDay = g.Key,
                    TicketsSold = g.Count() // Đếm số vé bán được
                })
                .FirstOrDefaultAsync(); // Use FirstOrDefaultAsync to get a single result

            return showtimeTicketsSold;
        }
    }
}
