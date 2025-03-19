using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetAllMovieTheatersAsync()
        {
            var movieTheaters = await _movieTheaterService.GetAllMovieTheatersAsync();
            return Ok(movieTheaters);
        }

        [HttpGet]
        [Route("{movieTheaterId}")]
        public async Task<IActionResult> GetMovieTheaterByIdAsync(Guid movieTheaterId)
        {
            var movieTheater = await _movieTheaterService.GetMovieTheaterByIdAsync(movieTheaterId);
            return Ok(movieTheater);
        }

        [HttpGet]
        [Route("page/{page}/{pageSize}")]
        public async Task<IActionResult> GetMovieTheaterPageAsync(int page, int pageSize)
        {
            var movieTheaters = await _movieTheaterService.GetMovieTheaterPageAsync(page, pageSize);
            return Ok(movieTheaters);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateMovieTheaterAsync([FromBody] MovieTheaterDto movieTheater)
        {
            var newMovieTheater = await _movieTheaterService.CreateMovieTheaterAsync(movieTheater);
            return Ok(newMovieTheater);
        }

        [HttpPut]
        [Route("update/{movieTheaterId}")]
        public async Task<IActionResult> UpdateMovieTheaterAsync(Guid movieTheaterId, [FromBody] MovieTheaterDto movieTheater)
        {
            var updatedMovieTheater = await _movieTheaterService.UpdateMovieTheaterAsync(movieTheaterId, movieTheater);
            return Ok(updatedMovieTheater);
        }

        [HttpDelete]
        [Route("delete/{movieTheaterId}")]
        public async Task<IActionResult> DeleteMovieTheaterAsync(Guid movieTheaterId)
        {
            var result = await _movieTheaterService.DeleteMovieTheaterAsync(movieTheaterId);
            return Ok(result);
        }



    }
}
