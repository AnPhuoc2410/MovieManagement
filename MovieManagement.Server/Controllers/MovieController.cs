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
        [Route("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var movies = await _movieService.GetAllAsync();
            return Ok(movies);
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            var movies = await _movieService.GetPageAsync(page, pageSize);
            return Ok(movies);
        }


        [HttpGet]
        [Route("GetById/{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> GetMovieById(Guid movieId)
        {
            return await _movieService.GetAsync(movieId);
        }

        [HttpGet("GetMoviesNowShowing/page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetMoviesNowShowing(int page, int pageSize)
        {
            var movies = await _movieService.GetMoviesNowShowing(page, pageSize);
            return Ok(movies);
        }

        [HttpGet("GetMoviesUpComing/page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetMoviesUpComing(int page, int pageSize)
        {
            var movies = await _movieService.GetMoviesUpComing(page, pageSize);
            return Ok(movies);
        }

        [HttpGet]
        [Route("SearchMoviesByNameRelative/{searchValue}")]
        public async Task<ActionResult> GetMoviesByNameRelative(string searchValue, int page, int pageSize)
        {
            var movies = await _movieService.GetMoviesByNameRelative(searchValue, page, pageSize);
            return Ok(movies);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<MovieDto>> CreateMovie(Guid employeeId, [FromBody] MovieRequest movieRequest)
        {
            return await _movieService.CreateAsync(employeeId, movieRequest);
        }


        [HttpPut]
        [Route("Update/{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> UpdateMovie(Guid movieId, [FromBody] MovieRequest movieRequest)
        {
            return await _movieService.UpdateAsync(movieId, movieRequest);
        }


        [HttpDelete]
        [Route("Delete/{movieId:guid}")]
        public async Task<bool> DeleteMovie(Guid movieId)
        {
            return await _movieService.SetMovieDeleted(movieId) != null;
        }
    }
}
