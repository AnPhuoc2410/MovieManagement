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

        Task<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>> GetTopShowtimeRevenues();
        Task<IEnumerable<TopShowtimeResponse.ShowtimeDaily>> GetTopShowtimeDailyRevenues(DateTime from, DateTime to);
        Task<long> GetTotalMembers();
        Task<List<long>> MemberDailyLast30Days();
        Task<List<long>> TotalMovieDailyLast30Days();
        Task<long> TotalTicketSold();
        Task<List<long>> TicketSoldLast30Days();
        Task<Dictionary<string, object>> DashboardOverview();
        Task<Dictionary<DateOnly, decimal>> GetRevenueByDate();
    }
}
