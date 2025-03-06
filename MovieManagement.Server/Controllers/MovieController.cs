using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Services;
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
        [ProducesResponseType(typeof(ApiResponseServices<MovieDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                var movies = await _movieService.GetAllMoviesAsync();
                var response = new ApiResponseServices<IEnumerable<MovieDto>>
                {
                    StatusCode = 200,
                    Message = "Movie retrived successfully",
                    IsSuccess = true,
                    Data = movies
                };
                return Ok(movies);

            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<IEnumerable<MovieDto>>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<IEnumerable<MovieDto>>
                {
                    StatusCode = 404,
                    Message = "Movie not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpGet("page/{page:int}/pageSize/{pageSize:int}")]
        public async Task<ActionResult> GetPageAsync(int page, int pageSize)
        {
            try
            {
                var movies = await _movieService.GetPageAsync(page, pageSize);
                if(movies == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Movie not found",
                        IsSuccess = false,
                    };
                    return NotFound(response);
                }
                return Ok(movies);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }


        }


        [HttpGet]
        [Route("GetById/{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> GetMovieById(Guid movieId)
        {
            try
            {
                var movie = await _movieService.GetMovieByIdAsync(movieId);
                if (movie == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Movie not found",
                        IsSuccess = false,
                    };
                    return NotFound(response);
                }
                return Ok(movie);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while retrieving movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
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
        public async Task<ActionResult<MovieDto>> CreateMovie(Guid employeeId, [FromBody] MovieDto movieDto)
        {
            try
            {
                var createdMovie = await _movieService.CreateMovieAsync(employeeId, movieDto);
                return Ok(createdMovie);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (NotFoundException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 404,
                    Message = "Movie not found",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return NotFound(response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while creating movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpPut]
        [Route("Update/{movieId:guid}")]
        public async Task<ActionResult<MovieDto>> UpdateMovie(Guid movieId, [FromBody] MovieDto movieDto)
        {
            try
            {
                var updatedRoom = await _movieService.UpdateMovieAsync(movieId, movieDto);
                if (updatedRoom == null)
                {
                    var response = new ApiResponseServices<object>
                    {
                        StatusCode = 404,
                        Message = "Movie not found",
                        IsSuccess = false,
                    };
                    return NotFound(response);
                }
                return Ok(updatedRoom);
            }
            catch (BadRequestException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 400,
                    Message = "Bad request from client side",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 401,
                    Message = "Unauthorized Access",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }
            catch (Exception ex)
            {
                var response = new ApiResponseServices<object>
                {
                    StatusCode = 500,
                    Message = "An error occurred while updating movie",
                    IsSuccess = false,
                    Reason = ex.Message
                };
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }


        [HttpDelete]
        [Route("Delete/{movieId:guid}")]
        public async Task<bool> DeleteMovie(Guid movieId)
        {
            return await _movieService.DeleteMovieAsync(movieId);
        }
    }
}
