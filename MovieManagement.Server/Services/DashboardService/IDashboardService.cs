using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.DashboardService
{
    public interface IDashboardService
    {
        Task<IEnumerable<TopCategoryResponse.CategoryRevenue>> GetTopCategoryRevenue();
        Task<IEnumerable<TopCategoryResponse.Daily>> GetTopCategoryDailyRevenue(DateTime from, DateTime to);
    }
}
