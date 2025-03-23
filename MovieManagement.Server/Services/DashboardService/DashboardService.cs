using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.Enums;
using MovieManagement.Server.Models.ResponseModel;
using static MovieManagement.Server.Models.Enums.TicketEnum;

namespace MovieManagement.Server.Services.DashboardService
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TopCategoryResponse.CategoryRevenue>> GetTopCategoryRevenue()
        {
            // Lấy ra số vé mà thể loại phim đó bán ra được
            var categoryTicketsSold = await _unitOfWork.CategoryRepository.GetCategoryHaveTicketsSold();

            // Sắp xếp theo thứ tự giảm dần
            categoryTicketsSold = categoryTicketsSold.OrderByDescending(c => c.TicketsSold).ToList();

            return categoryTicketsSold;
        }

        public async Task<IEnumerable<List<TopCategoryResponse.Daily>>> GetTopCategoryDailyRevenue()
        {
            return null;
        }

        /// <summary>
        /// Hàm lấy danh sách ngày từ ngày bắt đầu đến ngày kết thúc.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        private List<DateTime> GetFromTo(DateTime from, DateTime to)
        {
            var dates = new List<DateTime>();

            DateTime nextDate = to.AddDays(1);

            // Loop from the first day of the month until we hit the next month, moving forward a day at a time
            for (var date = from; date.Date != nextDate.Date; date = date.AddDays(1))
            {
                dates.Add(date);
            }

            return dates;
        }
    }
}
