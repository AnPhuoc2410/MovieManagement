using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
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

        public async Task<List<TicketDetail>> GetTicketByBillIdAsync(Guid billId)
        {
            return await _context.TicketDetails
                .Where(b => b.BillId == billId)
                .ToListAsync();
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

        public async Task<List<PurchasedTicketResponse>> GetPurchasedTicketsByBillId(Guid billId)
        {
            return await _context.Bills
                .Where(b => b.BillId == billId)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.ShowTime)
                        .ThenInclude(st => st.Movie)
                            .ThenInclude(m => m.MovieCategories)
                                .ThenInclude(mc => mc.Category)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.Seat)
                        .ThenInclude(s => s.SeatType)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.Seat)
                        .ThenInclude(s => s.Room)
                .SelectMany(b => b.TicketDetails.Select(td => new PurchasedTicketResponse
                {
                    MovieImage = td.ShowTime.Movie.Image,
                    MovieName = td.ShowTime.Movie.MovieName,
                    MovieCategories = td.ShowTime.Movie.MovieCategories.Select(mc => mc.Category.Name).ToList(),
                    StartDay = td.ShowTime.StartTime.ToString("dd/MM/yyyy"),
                    StartTime = td.ShowTime.StartTime.ToString("HH:mm:ss"),
                    RoomName = td.ShowTime.Room.RoomName,
                    AtRow = td.Seat.AtRow,
                    AtColumn = td.Seat.AtColumn,
                    SeatType = td.Seat.SeatType.TypeName,
                }))
                .ToListAsync();
        }

        public async Task<TicketDetail> GetTicketByIdAndVersion(Guid id, byte[] version)
        {
            return await _context.TicketDetails
                .FirstOrDefaultAsync(td => td.TicketId == id && td.Version == version);
        }
    }
}
