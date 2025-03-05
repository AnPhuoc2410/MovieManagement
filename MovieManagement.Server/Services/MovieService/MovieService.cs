using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.Drawing.Printing;

namespace MovieManagement.Server.Services.MovieService
{
    public class MovieService : IMovieService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public MovieService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<MovieDto>> GetAllMoviesAsync()
        {
            var movies = _mapper.Map<List<MovieDto>>(await _unitOfWork.MovieRepository.GetAllAsync());
            if (movies.Count == 0)
            {
                throw new NotFoundException("Movie does not found");
            }
            return movies;
        }
        public async Task<IEnumerable<MovieDto>> GetPageAsync(int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }
        public async Task<MovieDto> GetMovieByIdAsync(Guid movieId)
        {
            try
            {
                var movies = _mapper.Map<MovieDto>(await _unitOfWork.MovieRepository.GetByIdAsync(movieId));
                if(movies == null)
                {
                    throw new NotFoundException("Movie does not found");
                }
                return movies;
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<MovieDto> CreateMovieAsync(Guid employeeId, MovieDto movieDto)
        {
            //var newMovie = new Movie
            //{
            //    Name = movieDto.Name,
            //    Image = movieDto.Image,
            //    PostDate = movieDto.PostDate,
            //    FromDate = movieDto.FromDate,
            //    ToDate = movieDto.ToDate,
            //    Actors = movieDto.Actors,
            //    Director = movieDto.Director,
            //    Rating = movieDto.Rating,
            //    Duration = movieDto.Duration,
            //    Version = movieDto.Version,
            //    Trailer = movieDto.Trailer,
            //    Content = movieDto.Content,
            //    UserId = employeeId,
            //};

            movieDto.UserId = employeeId;
            movieDto.MovieId = null;
            var movie = await _unitOfWork.MovieRepository.CreateAsync(_mapper.Map<Movie>(movieDto));
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieDto movieDto)
        {
            var updateMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);

            updateMovie.Name = movieDto.Name;
            updateMovie.Image = movieDto.Image;
            updateMovie.PostDate = movieDto.PostDate;
            updateMovie.FromDate = movieDto.FromDate;
            updateMovie.ToDate = movieDto.ToDate;
            updateMovie.Actors = movieDto.Actors;
            updateMovie.Director = movieDto.Director;
            updateMovie.Rating = movieDto.Rating;
            updateMovie.Duration = movieDto.Duration;
            updateMovie.Version = movieDto.Version;
            updateMovie.Trailer = movieDto.Trailer;
            updateMovie.Content = movieDto.Content;
            updateMovie.UserId = movieDto.UserId;

            var updatedMovie = await _unitOfWork.MovieRepository.UpdateAsync(updateMovie);
            return _mapper.Map<MovieDto>(updatedMovie);
        }

        public Task<bool> DeleteMovieAsync(Guid movieId)
        {
            return _unitOfWork.MovieRepository.DeleteAsync(movieId);
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesNowShowing(int page, int pageSize)
        {
            var moviesNowShowing = await _unitOfWork.MovieRepository.GetMoviesNowShowing(page, pageSize);
            return _mapper.Map<IEnumerable<MovieDto>>(moviesNowShowing);
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesUpComing(int page, int pageSize)
        {
            var moviesUpComing = await _unitOfWork.MovieRepository.GetMoviesUpComing(page, pageSize);
            return _mapper.Map<IEnumerable<MovieDto>>(moviesUpComing);
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesByNameRelative(string name, int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetMoviesByNameRelative(name, page, pageSize);
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }
        
    }
}
