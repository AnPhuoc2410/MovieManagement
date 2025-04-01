using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories.IRepositories;
using static MovieManagement.Server.Models.Enums.BillEnum;
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

        public Task<bool> CheckStartTimeAsync(DateTime startTime, Guid movieTheaterId)
        {
            var showtime = _context.Showtimes
                .Include(st => st.Room)
                    .ThenInclude(r => r.MovieTheater);
            if (showtime.Any(st => st.StartTime == startTime && st.Room.MovieTheater.MovieTheaterId == movieTheaterId))
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

        public async Task<List<ShowTime>> GetShowTimeFromDateToDate(Guid movieId, DateTime date1, DateTime date2, string location)
        {
            var showTimes = await _context.Showtimes
                .Include(st => st.Room)
                    .ThenInclude(r => r.MovieTheater)
                .Where(st => st.MovieId == movieId && st.StartTime.Date >= date1.Date && st.StartTime.Date <= date2.Date && st.StartTime.AddMinutes(15).CompareTo(DateTime.Now) > 0 && st.Room.MovieTheater.Location == location)
                .OrderBy(st => st.StartTime)
                .ToListAsync();
            return showTimes;
        }

        public async Task<List<ShowTime>> GetAllInfoAsync()
        {
            var showTimes = await _context.Showtimes
                .Include(st => st.Movie)
                .Include(st => st.Room)
                    .ThenInclude(r => r.MovieTheater)
                .ToListAsync();
            return showTimes;
        }

        public async Task<List<ShowTime>> GetTopShowtimeRevenues(DateTime time)
        {
            var showtimeRevenue = await _context.Showtimes
                .Where(st => st.StartTime.Hour >= time.Hour && st.StartTime.Hour < time.AddHours(1).Hour)
                .Include(st => st.TicketDetails.Where(td => td.Status == TicketStatus.Paid && td.Bill.Status == BillStatus.Completed))
                .ThenInclude(td => td.Bill)
                .ToListAsync();
            return showtimeRevenue;
        }

        public async Task<List<ShowTime>> GetTopShowtimeDailyRevenues(DateTime from, DateTime to, DateTime timeInDay, DateTime day)
        {
            var showtimeRevenue = await _context.Showtimes
                .Where(st => st.StartTime.Hour >= timeInDay.Hour && st.StartTime.Hour < timeInDay.AddHours(1).Hour && st.StartTime.Day == day.Day)
                .Include(st => st.TicketDetails.Where(td => td.Status == TicketStatus.Paid && td.Bill.Status == BillStatus.Completed))
                    .ThenInclude(td => td.Bill)
                .ToListAsync();
            return showtimeRevenue;
        }
    }
}
