using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Data
{
    public interface IUnitOfWork : IDisposable
    {
        // Kế thừa interface IDisposable để xử lý việc lỗi disposable và memory leak
        IBillRepository BillRepository { get; }
        ICategoryRepository CategoryRepository { get; }
        IUserRepository UserRepository { get; }
        IMovieRepository MovieRepository { get; }
        IMovieCategoryRepository MovieCategoryRepository { get; }
        IPromotionRepository PromotionRepository { get; }
        IRoomRepository RoomRepository { get; }
        ISeatRepository SeatRepository { get; }
        IShowtimeRepository ShowtimeRepository { get; }
        ITicketDetailRepository TicketDetailRepository { get; }
        ISeatTypeRepository SeatTypeRepository { get; }

        Task<int> CompleteAsync();
    }
}
