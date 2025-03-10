using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories;
using MovieManagement.Server.Services.CategoryService;
using System.Drawing.Printing;

namespace MovieManagement.Server.Services.MovieService
{
    public class MovieService : IMovieService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICategoryService _categoryService;
        public MovieService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MovieDto>> GetAllMoviesAsync()
        {
            var movies = _mapper.Map<List<MovieDto>>(await _unitOfWork.MovieRepository.GetAllAsync());
            if (movies == null)
            {
                throw new NotFoundException("Movies do not found!");
            }
            return movies;
        }
        public async Task<IEnumerable<MoviePreview>> GetPageAsync(int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetMovieByPage(page, pageSize);
            return _mapper.Map<IEnumerable<MoviePreview>>(movies);
        }

        public async Task<MovieDto> GetMovieByIdAsync(Guid movieId)
        {
            var movie = await _unitOfWork.MovieRepository.GetMovieById(movieId);
            if (movie == null)
            {
                throw new NotFoundException("Movie does not found!");
            }
            var response = _mapper.Map<MovieDto>(movie);
            var movieCategories = _unitOfWork.MovieCategoryRepository.GetMovieCategoriesByMovieId(movieId);
            foreach (var movieCategory in movieCategories)
            {
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(movieCategory.CategoryId);
                response.Categories.Add(_mapper.Map<CategoryDto>(category));
            }
            return response;
        }

        public async Task<MovieDto> CreateMovieAsync(Guid employeeId, MovieRequest movieRequest)
        {

            movieRequest.UserId = employeeId;
            var movie = await _unitOfWork.MovieRepository.CreateAsync(_mapper.Map<Movie>(movieRequest));
            var response = _mapper.Map<MovieDto>(movie);

            if(movieRequest.CategoriesIds.Count != 0)
                foreach (var categoryId in movieRequest.CategoriesIds)
                {
                    var movieCategory = new MovieCategory
                    {
                        MovieId = movie.MovieId.Value,
                        CategoryId = categoryId
                    };
                    _unitOfWork.MovieCategoryRepository.Create(movieCategory);
                    var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
                    response.Categories.Add(_mapper.Map<CategoryDto>(category));
                }
            return response;
        }

        public async Task<MovieDto> UpdateMovieAsync(Guid movieId, MovieRequest movieRequest)
        {
            var updateMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);

            movieRequest.UserId = updateMovie.UserId;
            updateMovie = _mapper.Map(movieRequest, updateMovie);

            var updateMovieCategories = _unitOfWork.MovieCategoryRepository.GetMovieCategoriesByMovieId(updateMovie.MovieId.Value);

            if (updateMovieCategories.Count > 0)
                foreach (var x in updateMovieCategories)
                {
                    await _unitOfWork.MovieCategoryRepository.DeleteAsync(x);
                }

            var updatedMovie = await _unitOfWork.MovieRepository.UpdateAsync(updateMovie);
            var response = _mapper.Map<MovieDto>(updatedMovie);

            if (movieRequest.CategoriesIds.Count != 0)
                foreach (var categoryId in movieRequest.CategoriesIds)
                {
                    var movieCategory = new MovieCategory
                    {
                        MovieId = updateMovie.MovieId.Value,
                        CategoryId = categoryId
                    };
                    await _unitOfWork.MovieCategoryRepository.CreateAsync(movieCategory);
                    var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
                    response.Categories.Add(_mapper.Map<CategoryDto>(category));
                }

            return response;
        }

        public async Task<bool> DeleteMovieAsync(Guid movieId)
        {
            try
            {
                var existingMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
                if (existingMovie == null)
                    throw new NotFoundException("Movie cannot found!");
                return await _unitOfWork.MovieRepository.DeleteAsync(movieId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesNowShowing(int page, int pageSize)
        {
            var moviesNowShowing = await _unitOfWork.MovieRepository.GetMoviesNowShowing(page, pageSize);
            return _mapper.Map<IEnumerable<MoviePreview>>(moviesNowShowing);
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesUpComing(int page, int pageSize)
        {
            var moviesUpComing = await _unitOfWork.MovieRepository.GetMoviesUpComing(page, pageSize);
            return _mapper.Map<IEnumerable<MoviePreview>>(moviesUpComing);
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesByNameRelative(string name, int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetMoviesByNameRelative(name, page, pageSize);
            return _mapper.Map<IEnumerable<MoviePreview>>(movies);
        }

        public async Task<MovieDto> SetMovieDeleted(Guid movieId)
        {
            var movie = await _unitOfWork.MovieRepository.SetMovieDeleted(movieId);
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesByCategory(Guid categoryId, int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetMoviesByCategory(categoryId, page, pageSize);
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }

    }
}
