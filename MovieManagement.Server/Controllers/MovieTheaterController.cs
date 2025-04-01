using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.MovieTheaterService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieTheaterController : ControllerBase
    {
        private readonly IMovieTheaterService _movieTheaterService;

        public MovieTheaterController(IMovieTheaterService movieTheaterService)
        {
            _movieTheaterService = movieTheaterService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MovieTheaterDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllMovieTheatersAsync()
        {
            var movieTheaters = await _movieTheaterService.GetAllMovieTheatersAsync();
            var response = new ApiResponse<IEnumerable<MovieTheaterDto>>
            {
                StatusCode = 200,
                Message = "Get all movie theaters is success",
                IsSuccess = true,
                Data = movieTheaters
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("{movieTheaterId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<MovieTheaterDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMovieTheaterByIdAsync(Guid movieTheaterId)
        {
            var movieTheater = await _movieTheaterService.GetMovieTheaterByIdAsync(movieTheaterId);
            var response = new ApiResponse<MovieTheaterDto>
            {
                StatusCode = 200,
                Message = "Get movie theater is success",
                IsSuccess = true,
                Data = movieTheater
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("page/{page}/size/{pageSize}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MovieTheaterDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMovieTheaterPageAsync(int page, int pageSize)
        {
            var movieTheaters = await _movieTheaterService.GetMovieTheaterPageAsync(page, pageSize);
            var response = new ApiResponse<IEnumerable<MovieTheaterDto>>
            {
                StatusCode = 200,
                Message = "Get movie theaters is success",
                IsSuccess = true,
                Data = movieTheaters
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<MovieTheaterDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateMovieTheaterAsync([FromBody] MovieTheaterDto movieTheater)
        {
            var newMovieTheater = await _movieTheaterService.CreateMovieTheaterAsync(movieTheater);
            var response = new ApiResponse<MovieTheaterDto>
            {
                StatusCode = 200,
                Message = "Create movie theater is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{movieTheaterId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<MovieTheaterDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateMovieTheaterAsync(Guid movieTheaterId, [FromBody] MovieTheaterDto movieTheater)
        {
            var updatedMovieTheater = await _movieTheaterService.UpdateMovieTheaterAsync(movieTheaterId, movieTheater);
            var response = new ApiResponse<MovieTheaterDto>
            {
                StatusCode = 200,
                Message = "Update movie theater is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete]
        [Route("{movieTheaterId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<MovieTheaterDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteMovieTheaterAsync(Guid movieTheaterId)
        {
            var result = await _movieTheaterService.DeleteMovieTheaterAsync(movieTheaterId);
            var response = new ApiResponse<MovieTheaterDto>
            {
                StatusCode = 200,
                Message = "Delete movie theater is success",
                IsSuccess = true,
            };
            return Ok(response);
        }
    }
}
