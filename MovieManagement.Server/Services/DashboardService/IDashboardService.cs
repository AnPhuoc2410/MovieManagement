using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.DashboardService
{
    public interface IDashboardService
    {
        Task<IEnumerable<TopCategoryResponse.CategoryRevenue>> GetTopCategoryRevenues();
        Task<IEnumerable<TopCategoryResponse.Daily>> GetTopCategoryDailyRevenues(DateTime from, DateTime to);

        Task<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>> GetTopShowtimeRevenues();
    }
}
