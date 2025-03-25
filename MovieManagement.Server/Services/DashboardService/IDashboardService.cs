using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.DashboardService
{
    public interface IDashboardService
    {
        Task<IEnumerable<TopMemberResponse.MemberRevenue>> GetTopMemberRevenues();

        Task<IEnumerable<TopMovieResponse.MovieRevenue>> GetTopMovieRevenues();
        Task<IEnumerable<TopMovieResponse.MovieDaily>> GetTopMovieDailyRevenues(DateTime from, DateTime to);

        Task<IEnumerable<TopCategoryResponse.CategoryRevenue>> GetTopCategoryRevenues();
        Task<IEnumerable<TopCategoryResponse.Daily>> GetTopCategoryDailyRevenues(DateTime from, DateTime to);

        Task<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>> GetTopShowtimeRevenues();
        Task<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>> GetTopShowtimeDailyRevenues(DateTime from, DateTime to);
    }
}
