﻿using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IMovieRepository : IGenericRepository<Movie>
    {
        /// <summary>
        /// Lấy ra danh sách phim đang chiếu theo trang và không bị xóa
        /// </summary>
        Task<List<Movie>> GetMovieByPage(int page, int pageSize);

        /// <summary>
        /// Lấy ra phim theo id và không bị xóa
        /// </summary>
        Task<Movie> GetMovieById(Guid movieId);
        Task<List<Movie>> GetMoviesNowShowing(int page, int pageSize);
        Task<List<Movie>> GetMoviesUpComing(int page, int pageSize);
        Task<List<Movie>> GetMoviesByNameRelativePage(string name, int page, int pageSize);
        Task<List<Movie>> GetMoviesByCategory(Guid categoryId, int page, int pageSize);
        Task<Movie> SetMovieDeleted(Guid movieId);
        Task<List<Movie>> GetMoviesByNameRelative(string searchValue);
        Task<List<Movie>> GetAllAsyncDeletedFalse();

        Task<List<TopMovieResponse.MovieRevenue>> GetTopMovieRevenue();
        Task<TopMovieResponse.MovieDaily> GetTopMovieDailyRevenue(DateTime time);
        Task<List<long>> TotalMovieDailyLast30Days();
    }
}
