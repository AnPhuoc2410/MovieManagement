using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services.MovieService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : Controller
    {
        private readonly IMovieService _movieService;


        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }


        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllMovieAsync()
        {
            var movies = await _movieService.GetAllMoviesAsync();
            return Ok(movies);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<IActionResult> GetMoviePageAsync(int page, int pageSize)
        {
            var movies = await _movieService.GetMoviePageAsync(page, pageSize);
            return Ok(movies);
        }


        [HttpGet]
        [Route("GetById/{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> GetMovieByIdAsync(Guid movieId)
        {
            return await _movieService.GetMovieByIdAsync(movieId);
        }


        [HttpPost]
        public async Task<ActionResult<MovieDto>> CreateMovieAsync(Guid employeeId, [FromBody] MovieDto movieDto)
        {
            return await _movieService.CreateMovieAsync(employeeId, movieDto);
        }


        [HttpPut]
        [Route("{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> UpdateRoomAsync(Guid movieId, [FromBody] MovieDto movieDto)
        {
            return await _movieService.UpdateMovieAsync(movieId, movieDto);
        }


        [HttpDelete]
        [Route("{movieId:guid}")]
        public async Task<bool> DeleteRoomAsync(Guid movieId)
        {
            return await _movieService.DeleteMovieAsync(movieId);
        }


    }
}
