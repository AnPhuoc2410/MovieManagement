using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
            try
            {
                var movies = _mapper.Map<List<MovieDto>>(await _unitOfWork.MovieRepository.GetAllAsync());
                if (movies.Count == 0)
                {
                    throw new NotFoundException("Movies do not found!");
                }
                return movies;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
        public async Task<IEnumerable<MovieDto>> GetPageAsync(int page, int pageSize)
        {
            try
            {
                var movies = await _unitOfWork.MovieRepository.GetPageAsync(page, pageSize);
                if (movies.Count == 0)
                {
                    throw new NotFoundException("Movie pages do not found!");
                }
                return _mapper.Map<IEnumerable<MovieDto>>(movies);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
        public async Task<MovieDto> GetMovieByIdAsync(Guid movieId)
        {
            try
            {
                var movies = _mapper.Map<MovieDto>(await _unitOfWork.MovieRepository.GetByIdAsync(movieId));
                if(movies == null)
                {
                    throw new NotFoundException("Movie does not found!");
                }
                return movies;
            }
            catch (Exception ex)
            {

                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<MovieDto> CreateMovieAsync(Guid userId, MovieDto movieDto)
        {
            try
            {
                movieDto.UserId = userId;
                movieDto.MovieId = Guid.NewGuid();
                var createdMovie = await _unitOfWork.MovieRepository.CreateAsync(_mapper.Map<Movie>(movieDto));
                if (createdMovie == null)
                    throw new NotFoundException("Movie cannot found!");
                return _mapper.Map<MovieDto>(createdMovie);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into Database", ex);
            }
        }

        public async Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieDto movieDto)
        {
            try
            {
                var existingMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
                if(existingMovie == null)
                {
                    throw new NotFoundException("Movie cannot found!");
                }
                var updatedMovie = await _unitOfWork.MovieRepository.UpdateAsync(_mapper.Map<Movie>(movieDto));
                if (updatedMovie == null)
                    throw new DbUpdateException("Movie cannot update!");
                return _mapper.Map<MovieDto>(updatedMovie);
            }
            catch (Exception ex) {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<bool> DeleteMovieAsync(Guid movieId)
        {
            try
            {
                var existingMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
                if (existingMovie == null)
                    throw new NotFoundException("Bill cannot found!");
                return await _unitOfWork.MovieRepository.DeleteAsync(movieId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesNowShowing(int page, int pageSize)
        {
            try
            {
                var moviesNowShowing = await _unitOfWork.MovieRepository.GetMoviesNowShowing(page, pageSize);
                if (moviesNowShowing == null)
                    throw new NotFoundException("Movie now showing cannot found!");
                return _mapper.Map<IEnumerable<MovieDto>>(moviesNowShowing);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesUpComing(int page, int pageSize)
        {
            try
            {
                var moviesUpComing = await _unitOfWork.MovieRepository.GetMoviesUpComing(page, pageSize);
                if (moviesUpComing == null)
                    throw new NotFoundException("Movie up coming cannot found!");
                return _mapper.Map<IEnumerable<MovieDto>>(moviesUpComing);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesByNameRelative(string name, int page, int pageSize)
        {
            try
            {
                var movies = await _unitOfWork.MovieRepository.GetMoviesByNameRelative(name, page, pageSize);
                if (movies == null)
                    throw new NotFoundException("Movie cannot found!");
                return _mapper.Map<IEnumerable<MovieDto>>(movies);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }
        
    }
}
