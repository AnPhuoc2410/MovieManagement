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
        public async Task<ActionResult> GetAll()
        {
            var movies = await _movieService.GetAllMoviesAsync();
            return Ok(movies);
        }
        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var movies = await _movieService.GetPageAsync(page, pageSize);
            return Ok(movies);
        }
        [HttpGet]
        [Route("{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> GetMovieById(Guid movieId)
        {
            return await _movieService.GetMovieByIdAsync(movieId);
        }
        [HttpPost]
        public async Task<ActionResult<MovieDto>> CreateMovie(Guid employeeId, [FromBody] MovieDto movieDto)
        {
            return await _movieService.CreateMovieAsync(employeeId, movieDto);
        }
        [HttpPut]
        [Route("{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> UpdateRoom(Guid movieId, [FromBody] MovieDto movieDto)
        {
            return await _movieService.UpdateMovieAsync(movieId, movieDto);
        }
        [HttpDelete]
        public async Task<bool> DeleteRoom(Guid movieId)
        {
            return await _movieService.DeleteMovieAsync(movieId);
        }
    }
}
