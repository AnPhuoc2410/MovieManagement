using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Data
{
    public interface IUnitOfWork : IDisposable
    {
        // Kế thừa interface IDisposable để xử lý việc lỗi disposable và memory leak
        IBillRepository BillRepository { get; }
        ICategoryDetailRepository CategoryDetailRepository { get; }
        ICategoryRepository CategoryRepository { get; }
        IEmployeeRepository EmployeeRepository { get; }
        IMemberRepository MemberRepository { get; }
        IMovieRepository MovieRepository { get; }
        IPromotionRepository PromotionRepository { get; }
        IRoomRepository RoomRepository { get; }
        ISeatRepository SeatRepository { get; }
        IShowtimeRepository ShowtimeRepository { get; }
        ITicketDetailRepository TicketDetailRepository { get; }
        ITicketTypeRepository TicketTypeRepository { get; }

        Task<int> CompleteAsync();
    }
}
