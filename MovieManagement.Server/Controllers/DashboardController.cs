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
                Message = "Top movie screenings with the most tickets sold",
                Data = showtimes
            };
            return Ok(response);
        }

        [HttpGet("showtime/daily")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetShowtimesDailyRevenueAsync(DateTime from, DateTime to)
        {
            var showtimes = await _dashboardService.GetTopShowtimeDailyRevenues(from, to);
            var response = new ApiResponse<IEnumerable<TopShowtimeResponse.ShowtimeRevenue>>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "Top movie screenings with the most tickets sold",
                Data = showtimes
            };
            return Ok(response);
        }
    }
}
