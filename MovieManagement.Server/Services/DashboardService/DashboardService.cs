using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.ResponseModel;
using System.Linq;
using static MovieManagement.Server.Models.Enums.BillEnum;
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

        public async Task<IEnumerable<TopMemberResponse.MemberRevenue>> GetTopMemberRevenues()
        {
            var topMembers = await _unitOfWork.UserRepository.GetTopMemberRevenue();
            return topMembers;
        }
        public async Task<IEnumerable<TopMemberResponse.MemberDaily>> GetTopMemberDailyRevenues(DateTime from, DateTime to)
        {
            if (from > to)
            {
                throw new BadRequestException("From date must be less than to date");
            }
            if (from == null || to == null)
            {
                throw new BadRequestException("From date and to date must not be null");
            }
            var timeDaily = GetFromTo(from, to);
            List<TopMemberResponse.MemberDaily> topMemberDaily = new List<TopMemberResponse.MemberDaily>();
            foreach (var day in timeDaily)
            {
                var memberDayRevenue = await _unitOfWork.UserRepository.GetTopMemberDailyRevenue(day);
                var filtered = memberDayRevenue.Where(m => m.MemberRevenues != null && m.MemberRevenues.Count > 0);
                topMemberDaily.AddRange(filtered);
            }
            return topMemberDaily;
        }

        public async Task<IEnumerable<TopMovieResponse.MovieRevenue>> GetTopMovieRevenues()
        {
            var topMovies = await _unitOfWork.MovieRepository.GetTopMovieRevenue();
            return topMovies;
        }
        public async Task<IEnumerable<TopMovieResponse.MovieDaily>> GetTopMovieDailyRevenues(DateTime from, DateTime to)
        {
            if (from > to)
            {
                throw new BadRequestException("From date must be less than to date");
            }
            if (from == null || to == null)
            {
                throw new BadRequestException("From date and to date must not be null");
            }
            var timeDaily = GetFromTo(from, to);

            List<TopMovieResponse.MovieDaily> topMovieDaily = new List<TopMovieResponse.MovieDaily>();

            foreach (var day in timeDaily)
            {
                var movieDayRevenue = await _unitOfWork.MovieRepository.GetTopMovieDailyRevenue(day);
                topMovieDaily.Add(movieDayRevenue);
            }
            return topMovieDaily;
        }

        public async Task<IEnumerable<TopCategoryResponse.CategoryRevenue>> GetTopCategoryRevenues()
        {
            // Lấy ra số vé mà thể loại phim đó bán ra được
            var categoryTicketsSold = await _unitOfWork.CategoryRepository.GetCategoryHaveTicketsSold();

            // Sắp xếp theo thứ tự giảm dần
            categoryTicketsSold = categoryTicketsSold.OrderByDescending(c => c.TicketsSold).ToList();

            return categoryTicketsSold;
        }
        public async Task<IEnumerable<TopCategoryResponse.Daily>> GetTopCategoryDailyRevenues(DateTime from, DateTime to)
        {
            if (from > to)
            {
                throw new BadRequestException("From date must be less than to date");
            }
            if (from == null || to == null)
            {
                throw new BadRequestException("From date and to date must not be null");
            }
            // Lấy ra danh sách thời gian chỉnh định theo từng ngày
            var timeDaily = GetFromTo(from, to);

            // Tạo ra danh sách chứa Top Category mỗi ngày
            List<TopCategoryResponse.Daily> topCategoryDaily = new List<TopCategoryResponse.Daily>();

            // Thêm từng danh sách vào danh sách chứa Top Category ShowtimeRevenue 
            foreach (var day in timeDaily)
            {
                var categoryDayRevenue = await _unitOfWork.CategoryRepository.GetCategoryHaveTicketsSoldDaily(day);
                topCategoryDaily.Add(categoryDayRevenue);
            }
            return topCategoryDaily.ToList();
        }

        public async Task<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>> GetTopShowtimeRevenues()
        {
            var topShowtimeRevenues = new TopShowtimeResponse.ShowtimeRevenue();

            foreach (var hour in GetHoursInDay())
            {
                var showTimes = await _unitOfWork.ShowtimeRepository.GetTopShowtimeRevenues(hour);

                string key = $"{hour:HH:mm}-{hour.AddHours(1):HH:mm}";

                decimal revenue = showTimes
                    .SelectMany(st => st.TicketDetails)
                    .Where(td => td.Bill != null)
                    .GroupBy(td => td.Bill.BillId)
                    .Select(g => g.First().BillId)
                    .Count();

                topShowtimeRevenues.TopRevenue.Add(key, revenue);
            }

            // Order by descending revenue and take the top 5
            var orderedTopRevenues = topShowtimeRevenues.TopRevenue
                .OrderByDescending(kvp => kvp.Value)
                .Take(5)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            return new List<TopShowtimeResponse.ShowtimeRevenue>
            {
                new TopShowtimeResponse.ShowtimeRevenue { TopRevenue = orderedTopRevenues }
            };
        }

        public async Task<IEnumerable<TopShowtimeResponse.ShowtimeDaily>> GetTopShowtimeDailyRevenues(DateTime from, DateTime to)
        {
            var topShowtimeRevenues = new List<TopShowtimeResponse.ShowtimeDaily>();
            var timeDaily = GetFromTo(from, to);
            var hoursInDay = GetHoursInDay();

            foreach (var time in timeDaily)
            {
                var revenueByHour = hoursInDay.ToDictionary(
                    hour => $"{hour:HH:mm}-{hour.AddHours(1):HH:mm}",
                    hour => _unitOfWork.ShowtimeRepository.GetTopShowtimeDailyRevenues(from, to, hour, time).Result
                        .SelectMany(st => st.TicketDetails)
                        .Where(td => td.Status == TicketStatus.Paid && td.Bill.Status == BillStatus.Completed)
                        .Sum(td => td.Bill.Amount));

                topShowtimeRevenues.Add(new TopShowtimeResponse.ShowtimeDaily
                {
                    Day = time,
                    ShowtimeRevenues = new List<TopShowtimeResponse.ShowtimeRevenue>
            {
                new TopShowtimeResponse.ShowtimeRevenue { TopRevenue = revenueByHour }
            }
                });
            }

            return topShowtimeRevenues;
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
        private List<DateTime> GetHoursInDay()
        {
            var hours = new List<DateTime>();
            DateTime start = DateTime.Today.AddHours(2);  // 2:00 AM
            DateTime end = DateTime.Today.AddHours(23);   // 11:00 PM

            for (DateTime current = start; current <= end; current = current.AddHours(1))
            {
                hours.Add(current);
            }

            return hours;
        }
        public async Task<long> GetTotalMembers()
        {
            return await _unitOfWork.UserRepository.GetTotalMembers();
        }

        public async Task<List<long>> MemberDailyLast30Days()
        {
            return await _unitOfWork.UserRepository.MemberDailyLast30Days();
        }

        public async Task<List<long>> TotalMovieDailyLast30Days()
        {
            return await _unitOfWork.MovieRepository.TotalMovieDailyLast30Days();
        }

        public async Task<long> TotalTicketSold()
        {
            return await _unitOfWork.TicketDetailRepository.TotalTicketSold();
        }

        public async Task<Dictionary<string, object>> DashboardOverview()
        {
            var overview = new Dictionary<string, object>();
            overview["totalMembers"] = await _unitOfWork.UserRepository.GetTotalMembers();
            overview["totalMovies"] = (await _unitOfWork.MovieRepository.GetAllAsync()).Count();
            overview["ticketsSold"] = await _unitOfWork.TicketDetailRepository.TotalTicketSold();
            overview["memberDailyLast30Days"] = await _unitOfWork.UserRepository.MemberDailyLast30Days();
            overview["movieDailyLast30Days"] = await _unitOfWork.MovieRepository.TotalMovieDailyLast30Days();
            overview["ticketSoldDailyLast30Days"] = await _unitOfWork.TicketDetailRepository.TicketDailyLast30Days();

            return overview;
        }

        public async Task<List<long>> TicketSoldLast30Days()
        {
            return await _unitOfWork.TicketDetailRepository.TicketDailyLast30Days();
        }

        public async Task<Dictionary<DateOnly, decimal>> GetRevenueByDate()
        {
            return await _unitOfWork.BillRepository.GetRevenueByDate();
        }
    }
}
