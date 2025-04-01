using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services;
using MovieManagement.Server.Services.MovieService;
using System.Globalization;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : Controller
    {
        private readonly IMovieService _movieService;
        private readonly IStringLocalizer<MovieController> _localizer;

        public MovieController(IMovieService movieService, IStringLocalizer<MovieController> localizer)
        {
            _movieService = movieService;
            _localizer = localizer;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MovieDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll()
        {
            var movies = await _movieService.GetAllMoviesAsync();
            var response = new ApiResponse<IEnumerable<MovieDto>>
            {
                StatusCode = 200,
                Message = "Get all movies is success",
                IsSuccess = true,
                Data = movies
            };
            return Ok(response);
        }


        [HttpGet("page/{page:int}/size/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MoviePreview>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var movies = await _movieService.GetPageAsync(page, pageSize);
            var response = new ApiResponse<IEnumerable<MoviePreview>>
            {
                StatusCode = 200,
                Message = "Get all movies is success",
                IsSuccess = true,
                Data = movies
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("{movieId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<MovieDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MovieDto>> GetMovieById(Guid movieId)
        {
            var movie = await _movieService.GetMovieByIdAsync(movieId);
            var response = new ApiResponse<MovieDto>
            {
                StatusCode = 200,
                Message = "Get movie is success",
                IsSuccess = true,
                Data = movie
            };
            return Ok(response);
        }

        [HttpGet("showing/page/{page:int}/size/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MoviePreview>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetMoviesNowShowing(int page, int pageSize)
        {
            var movies = await _movieService.GetMoviesNowShowing(page, pageSize);
            var response = new ApiResponse<IEnumerable<MoviePreview>>
            {
                StatusCode = 200,
                Message = "Get movie is showing",
                IsSuccess = true,
                Data = movies
            };
            return Ok(movies);
        }

        [HttpGet("coming-soon/page/{page:int}/size/{pageSize:int}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MoviePreview>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetMoviesUpComing(int page, int pageSize)
        {
            var movies = await _movieService.GetMoviesUpComing(page, pageSize);
            var response = new ApiResponse<IEnumerable<MoviePreview>>
            {
                StatusCode = 200,
                Message = "Get movie is coming soon",
                IsSuccess = true,
                Data = movies
            };
            return Ok(response);
        }

        [HttpGet]
        [Route("name-relative/{searchValue}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<MoviePreview>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetMoviesByNameRelative(string searchValue)
        {
            var movies = await _movieService.GetMoviesByNameRelative(searchValue);
            var response = new ApiResponse<IEnumerable<MoviePreview>>
            {
                StatusCode = 200,
                Message = "Get movie by name relative",
                IsSuccess = true,
                Data = movies
            };
            return Ok(response);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<MovieDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MovieDto>> CreateMovie(Guid employeeId, [FromBody] MovieRequest movieDto)
        {
            var createdMovie = await _movieService.CreateMovieAsync(employeeId, movieDto);
            var response = new ApiResponse<MovieDto>
            {
                StatusCode = 200,
                Message = "Movie is created",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpPut]
        [Route("{movieId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<MovieDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MovieDto>> UpdateMovie(Guid movieId, [FromBody] MovieRequest movieDto)
        {
            var updatedRoom = await _movieService.UpdateMovieAsync(movieId, movieDto);
            var response = new ApiResponse<MovieDto>
            {
                StatusCode = 200,
                Message = "Get movie is success",
                IsSuccess = true,
            };
            return Ok(response);
        }

        [HttpDelete]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
        [Route("{movieId:guid}")]
        public async Task<IActionResult> DeleteMovie(Guid movieId)
        {
            var isDeleted = await _movieService.DeleteMovieAsync(movieId);
            var response = new ApiResponse<bool>
            {
                StatusCode = 200,
                Message = "Delete movie is success",
                IsSuccess = true
            };
            return Ok(response);
        }
    }
}
