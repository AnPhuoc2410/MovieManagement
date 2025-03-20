using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;
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

        

        public async Task<List<TicketBillResponse>> GetPurchasedTicketsForBill(long billId)
        {
            return await _context.Bills
                .Where(b => b.BillId == billId)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.ShowTime)
                        .ThenInclude(st => st.Room)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.ShowTime)
                        .ThenInclude(st => st.Movie)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.Seat)
                .SelectMany(b => b.TicketDetails.Select(td => new TicketBillResponse
                {
                    MovieName = td.ShowTime.Movie.MovieName,
                    StartDay = td.ShowTime.StartTime.ToString("dd/MM/yyyy"),
                    StartTime = td.ShowTime.StartTime.ToString("HH:mm:ss"),
                    SeatType = td.Seat.SeatType.TypeName,
                    AtRow = td.Seat.AtRow,
                    AtColumn = td.Seat.AtColumn,
                    Price = td.Seat.SeatType.Price,
                    Status = b.Status
                }))
                .ToListAsync();
        }
    }
}
