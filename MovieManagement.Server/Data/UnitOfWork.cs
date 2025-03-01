﻿using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IBillRepository BillRepository { get; private set; }

        public ICategoryDetailRepository CategoryDetailRepository { get; private set; }

        public ICategoryRepository CategoryRepository { get; private set; }

        public IEmployeeRepository EmployeeRepository { get; private set; }

        //public IMemberRepository MemberRepository { get; private set; }

        public IMovieRepository MovieRepository { get; private set; }

        public IPromotionRepository PromotionRepository { get; private set; }

        public IRoomRepository RoomRepository { get; private set; }

        public ISeatRepository SeatRepository { get; private set; }

        public IShowtimeRepository ShowtimeRepository { get; private set; }

        public ITicketDetailRepository TicketDetailRepository { get; private set; }

        public ITicketTypeRepository TicketTypeRepository { get; private set; }

        public UnitOfWork(AppDbContext context, IBillRepository billRepository, ICategoryDetailRepository categoryDetailRepository, ICategoryRepository categoryRepository, IEmployeeRepository employeeRepository,  IMovieRepository movieRepository, IPromotionRepository promotionRepository, IRoomRepository roomRepository, ISeatRepository seatRepository, IShowtimeRepository showtimeRepository, ITicketDetailRepository ticketDetailRepository, ITicketTypeRepository ticketTypeRepository)
        {
            _context = context;
            BillRepository = billRepository;
            CategoryDetailRepository = categoryDetailRepository;
            CategoryRepository = categoryRepository;
            EmployeeRepository = employeeRepository;
            MovieRepository = movieRepository;
            PromotionRepository = promotionRepository;
            RoomRepository = roomRepository;
            SeatRepository = seatRepository;
            ShowtimeRepository = showtimeRepository;
            TicketDetailRepository = ticketDetailRepository;
            TicketTypeRepository = ticketTypeRepository;
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
