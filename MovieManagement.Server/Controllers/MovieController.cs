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


        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<MovieDto>> CreateMovie(Guid employeeId, [FromBody] MovieDto movieDto)
        {
            return await _movieService.CreateAsync(employeeId, movieDto);
        }


        [HttpPut]
        [Route("Update/{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> UpdateRoom(Guid movieId, [FromBody] MovieDto movieDto)
        {
            return await _movieService.UpdateAsync(movieId, movieDto);
        }


        [HttpDelete]
        [Route("Delete/{movieId:guid}")]
        public async Task<bool> DeleteRoom(Guid movieId)
        {
            return await _movieService.DeleteAsync(movieId);
        }


    }
}
