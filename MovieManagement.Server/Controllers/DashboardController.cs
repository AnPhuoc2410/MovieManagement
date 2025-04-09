using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Services.DashboardService;
using Org.BouncyCastle.Crypto.Digests;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {

        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }
        [HttpGet("overview")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DashboardOverview()
        {
            var response = new ApiResponse<Dictionary<string, object>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Overview",
                Data = await _dashboardService.DashboardOverview()
            };
            return Ok(response);
        }
        [HttpGet("revenue")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DashboardRevenue()
        {
            var response = new ApiResponse<Dictionary<DateOnly, decimal>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Revenue",
                Data = await _dashboardService.GetRevenueByDate()
            };
            return Ok(response);
        }
        [HttpGet("total-ticket-sold")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTotalTicketSold()
        {
            var response = new ApiResponse<long>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Total ticket sold",
                Data = await _dashboardService.TotalTicketSold()
            };
            return Ok(response);
        }
        [HttpGet("ticket-sold-daily-last-30-days")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> TicketSoldDailyLast30Days()
        {
            var response = new ApiResponse<List<long>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "List number of ticket sold each day in last 30 days",
                Data = await _dashboardService.TicketSoldLast30Days()
            };
            return Ok(response);
        }
        [HttpGet("total-member")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTotalMembersAsync()
        {
            var totalMember = await _dashboardService.GetTotalMembers();
            var response = new ApiResponse<long>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Total member",
                Data = totalMember
            };
            return Ok(response);
        }
        [HttpGet("member-daily-last-30-days")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> MemberDailyLast30Days()
        {
            var response = new ApiResponse<List<long>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "List number of member join each day in last 30 days",
                Data = await _dashboardService.MemberDailyLast30Days()
            };
            return Ok(response);
        }
        [HttpGet("member")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMembersRevenueAsync()
        {
            var movies = await _dashboardService.GetTopMemberRevenues();
            var response = new ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top member with the highest number of tickets purchased",
                Data = movies
            };
            return Ok(response);
        }

        [HttpGet("member/daily")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberDaily>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMembersDailyRevenueAsync(DateTime from, DateTime to)
        {
            var movies = await _dashboardService.GetTopMemberDailyRevenues(from, to);
            var response = new ApiResponse<IEnumerable<TopMemberResponse.MemberDaily>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top member with the highest number of tickets purchased each day",
                Data = movies
            };
            return Ok(response);
        }

        [HttpGet("movie")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMovieResponse.MovieRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMoviesRevenueAsync()
        {
            var movies = await _dashboardService.GetTopMovieRevenues();
            var response = new ApiResponse<IEnumerable<TopMovieResponse.MovieRevenue>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top grossing movies",
                Data = movies
            };
            return Ok(response);
        }

        [HttpGet("movie/daily")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMovieResponse.MovieDaily>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMoviesDailyRevenueAsync(DateTime from, DateTime to)
        {
            var movies = await _dashboardService.GetTopMovieDailyRevenues(from, to);
            var response = new ApiResponse<IEnumerable<TopMovieResponse.MovieDaily>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top grossing movies each day",
                Data = movies
            };
            return Ok(response);
        }
        [HttpGet("movies-daily-last-30-days")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopMemberResponse.MemberRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> TotalMovieDailyLast30Days()
        {
            var response = new ApiResponse<List<long>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "List number of movies added each day in last 30 days",
                Data = await _dashboardService.TotalMovieDailyLast30Days()
            };
            return Ok(response);
        }
        [HttpGet("category")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopCategoryResponse.CategoryRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategoriesRevenueAsync()
        {
            var catogories = await _dashboardService.GetTopCategoryRevenues();
            var response = new ApiResponse<IEnumerable<TopCategoryResponse.CategoryRevenue>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top movie genres with the most tickets sold",
                Data = catogories
            };
            return Ok(response);
        }

        [HttpGet("catogory/daily")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopCategoryResponse.Daily>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategoriesDailyRevenueAsync(DateTime from, DateTime to)
        {
            var catogories = await _dashboardService.GetTopCategoryDailyRevenues(from, to);
            var response = new ApiResponse<IEnumerable<TopCategoryResponse.Daily>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top movie genres with the most tickets sold by day",
                Data = catogories
            };
            return Ok(response);
        }

        [HttpGet("showtime")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetShowtimesRevenueAsync()
        {
            var showtimes = await _dashboardService.GetTopShowtimeRevenues();
            var response = new ApiResponse<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top showtime genres with the most tickets sold",
                Data = showtimes
            };
            return Ok(response);
        }

        [HttpGet("showtime/daily")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopShowtimeResponse.ShowtimeDaily>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetShowtimesDailyRevenueAsync(DateTime from, DateTime to)
        {
            var showtimes = await _dashboardService.GetTopShowtimeDailyRevenues(from, to);
            var response = new ApiResponse<IEnumerable<TopShowtimeResponse.ShowtimeDaily>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top showtime genres with the most tickets sold by day",
                Data = showtimes
            };
            return Ok(response);
        }
    }
}
