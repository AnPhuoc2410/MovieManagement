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
            var newMovie = _mapper.Map<Movie>(movieDto);
            newMovie.UserId = userId;
            newMovie.MovieId = Guid.NewGuid();
            var createdMovie = await _unitOfWork.MovieRepository.CreateAsync(newMovie);
            return _mapper.Map<MovieDto>(createdMovie);
        }

        public async Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieDto movieDto)
        {
            var existingMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);

            existingMovie.MovieName = movieDto.MovieName;
            existingMovie.Image = movieDto.Image;
            existingMovie.PostDate = movieDto.PostDate;
            existingMovie.FromDate = movieDto.FromDate;
            existingMovie.ToDate = movieDto.ToDate;
            existingMovie.Actors = movieDto.Actors;
            existingMovie.Director = movieDto.Director;
            existingMovie.Rating = movieDto.Rating;
            existingMovie.Duration = movieDto.Duration;
            existingMovie.Version = movieDto.Version;
            existingMovie.Trailer = movieDto.Trailer;
            existingMovie.Content = movieDto.Content;
            existingMovie.UserId = movieDto.UserId;

            var updatedMovie = await _unitOfWork.MovieRepository.UpdateAsync(existingMovie);
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
