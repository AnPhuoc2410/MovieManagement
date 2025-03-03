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
        public async Task<List<PurchasedTicketDto>> GetPurchasedTickets(Guid userId)
        {
            //var purchasedTickets = await(from bill in _context.Bills
            //                             join ticketDetail in _context.TicketDetails on bill.BillId equals ticketDetail.BillId
            //                             join ticketType in _context.TicketTypes on ticketDetail.TicketTypeId equals ticketType.Id
            //                             join showtime in _context.Showtimes on ticketDetail.ShowTimeId equals showtime.ShowTimeId
            //                             join room in _context.Rooms on showtime.RoomId equals room.RoomId
            //                             join movie in _context.Movies on showtime.MovieId equals movie.MovieId
            //                             where bill.UserId == userId
            //                             select new PurchasedTicketDto
            //                             {
            //                                 MovieName = movie.MovieName,
            //                                 CreateDate = bill.CreatedDate,
            //                                 StartDay = showtime.StartTime.ToShortTimeString(),
            //                                 Showtime = showtime.StartTime.ToShortTimeString(),
            //                                 RoomName = room.RoomName,
            //                                 Price = ticketType.Price,
            //                                 Status = bill.Status
            //                             })
            //                             .ToListAsync();
            //return purchasedTickets;
            return await _context.Bills
                .Where(b => b.UserId == userId)
                .Include(b => b.TicketDetails)
                    .ThenInclude(td => td.TicketType)
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
                    Price = td.TicketType.Price,
                    Status = b.Status
                }))
                .ToListAsync();
        }
    }
}
