using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.DashboardService
{
    public interface IDashboardService
    {
        Task<IEnumerable<TopMemberResponse.MemberRevenue>> GetTopMemberRevenues();
        Task<IEnumerable<TopMemberResponse.MemberDaily>> GetTopMemberDailyRevenues(DateTime from, DateTime to);

        Task<IEnumerable<TopMovieResponse.MovieRevenue>> GetTopMovieRevenues();
        Task<IEnumerable<TopMovieResponse.MovieDaily>> GetTopMovieDailyRevenues(DateTime from, DateTime to);

        Task<IEnumerable<TopCategoryResponse.CategoryRevenue>> GetTopCategoryRevenues();
        Task<IEnumerable<TopCategoryResponse.Daily>> GetTopCategoryDailyRevenues(DateTime from, DateTime to);

       
    }
}
