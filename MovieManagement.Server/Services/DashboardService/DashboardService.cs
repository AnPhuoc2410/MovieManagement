using MovieManagement.Server.Data;
using MovieManagement.Server.Models.ResponseModel;

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

        public async Task<IEnumerable<TopCategoryResponse.Daily>> GetTopCategoryDailyRevenue(DateTime from, DateTime to)
        {
            // Lấy ra danh sách thời gian chỉnh định theo từng ngày
            var timeDaily = GetFromTo(from, to);

            // Tạo ra danh sách chứa Top Category mỗi ngày
            List<TopCategoryResponse.Daily> topCategoryDaily = new List<TopCategoryResponse.Daily>();

            // Thêm từng danh sách vào danh sách chứa Top Category Daily 
            foreach (var day in timeDaily)
            {
                var categoryDayeRevenue = await _unitOfWork.CategoryRepository.GetCategoryHaveTicketsSoldDaily(day);
                topCategoryDaily.Add(categoryDayeRevenue);
            }
            return topCategoryDaily.ToList();
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
