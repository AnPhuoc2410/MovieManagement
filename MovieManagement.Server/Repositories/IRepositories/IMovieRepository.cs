using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IMovieRepository : IGenericRepository<Movie>
    {
        /// <summary>
        /// Lấy ra danh sách phim đang chiếu theo trang và không bị xóa
        /// </summary>
        Task<List<Movie>> GetPage(int page, int pageSize);

        /// <summary>
        /// Lấy ra phim theo id và không bị xóa
        /// </summary>
        Task<Movie> GetMovieById(Guid movieId);
        Task<List<Movie>> GetMoviesNowShowing(int page, int pageSize);
        Task<List<Movie>> GetMoviesUpComing(int page, int pageSize);
        Task<List<Movie>> GetMoviesByNameRelative(string name, int page, int pageSize);
        //Task<List<Movie>> GetMoviesByCategory(Guid categoryId, int page, int pageSize);
        Task<Movie> SetMovieDeleted(Guid movieId);
    }
}
