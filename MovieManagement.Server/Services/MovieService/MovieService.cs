using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

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
            var movies = await _unitOfWork.MovieRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }
        public async Task<IEnumerable<MovieDto>> GetMoviePageAsync(int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }
        public async Task<MovieDto> GetMovieByIdAsync(Guid movieId)
        {
            var movie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<MovieDto> CreateMovieAsync(Guid userId, MovieDto movieDto)
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

    }
}
