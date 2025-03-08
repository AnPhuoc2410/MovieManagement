using AutoMapper;
using MovieManagement.Server.Data;
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
        public async Task<IEnumerable<MovieDto>> GetAllAsync()
        {
            var movies = await _unitOfWork.MovieRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<MovieDto>>(movies);
        }
        public async Task<IEnumerable<MoviePreview>> GetPageAsync(int page, int pageSize)
        {
            var movies = await _unitOfWork.MovieRepository.GetPage(page, pageSize);
            return _mapper.Map<IEnumerable<MoviePreview>>(movies);
        }
        public async Task<MovieDto> GetAsync(Guid movieId)
        {
            var movie = await _unitOfWork.MovieRepository.GetMovieById(movieId);
            var response = _mapper.Map<MovieDto>(movie);
            var movieCategories = _unitOfWork.MovieCategoryRepository.GetMovieCategoriesByMovieId(movieId);
            foreach (var movieCategory in movieCategories)
            {
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(movieCategory.CategoryId);
                response.Categories.Add(_mapper.Map<CategoryDto>(category));
            }
            return response;
        }

        public async Task<MovieDto> CreateAsync(Guid employeeId, MovieRequest movieRequest)
        {
            //var newMovie = new Movie
            //{
            //    Name = movieRequest.Name,
            //    Image = movieRequest.Image,
            //    PostDate = movieRequest.PostDate,
            //    FromDate = movieRequest.FromDate,
            //    ToDate = movieRequest.ToDate,
            //    Actors = movieRequest.Actors,
            //    Director = movieRequest.Director,
            //    Rating = movieRequest.Rating,
            //    Duration = movieRequest.Duration,
            //    Version = movieRequest.Version,
            //    Trailer = movieRequest.Trailer,
            //    Content = movieRequest.Content,
            //    UserId = employeeId,
            //};

            movieRequest.UserId = employeeId;
            var movie = await _unitOfWork.MovieRepository.CreateAsync(_mapper.Map<Movie>(movieRequest));
            var response = _mapper.Map<MovieDto>(movie);

            foreach (var categoryId in movieRequest.CategoriesIds)
            {
                var movieCategory = new MovieCategory
                {
                    MovieId = movie.MovieId,
                    CategoryId = categoryId
                };
                _unitOfWork.MovieCategoryRepository.Create(movieCategory);
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
                response.Categories.Add(_mapper.Map<CategoryDto>(category));
            }
            return response;
        }

        public async Task<MovieDto> UpdateAsync(Guid movieId, MovieRequest movieRequest)
        {
            var updateMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);

            updateMovie.Name = movieRequest.Name;
            updateMovie.Image = movieRequest.Image;
            updateMovie.PostDate = movieRequest.PostDate;
            updateMovie.FromDate = movieRequest.FromDate;
            updateMovie.ToDate = movieRequest.ToDate;
            updateMovie.Actors = movieRequest.Actors;
            updateMovie.Director = movieRequest.Director;
            updateMovie.Rating = movieRequest.Rating;
            updateMovie.Duration = movieRequest.Duration;
            updateMovie.Version = movieRequest.Version;
            updateMovie.Trailer = movieRequest.Trailer;
            updateMovie.Content = movieRequest.Content;
            updateMovie.UserId = movieRequest.UserId;
            var updateMovieCategories = _unitOfWork.MovieCategoryRepository.GetMovieCategoriesByMovieId(updateMovie.MovieId);

            if (updateMovieCategories.Count > 0)
                foreach (var x in updateMovieCategories)
                {
                    await _unitOfWork.MovieCategoryRepository.DeleteAsync(x);
                }

            var updatedMovie = await _unitOfWork.MovieRepository.UpdateAsync(updateMovie);
            var response = _mapper.Map<MovieDto>(updatedMovie);

            foreach (var categoryId in movieRequest.CategoriesIds)
            {
                var movieCategory = new MovieCategory
                {
                    MovieId = updateMovie.MovieId,
                    CategoryId = categoryId
                };
                await _unitOfWork.MovieCategoryRepository.CreateAsync(movieCategory);
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
                response.Categories.Add(_mapper.Map<CategoryDto>(category));
            }
            return response;
        }

        public Task<bool> DeleteAsync(Guid movieId)
        {
            return _unitOfWork.MovieRepository.DeleteAsync(movieId);
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

        //public async Task<IEnumerable<MovieDto>> GetMoviesByCategory(Guid categoryId, int page, int pageSize)
        //{
        //    var movies = await _unitOfWork.MovieRepository.GetMoviesByCategory(categoryId, page, pageSize);
        //    return _mapper.Map<IEnumerable<MovieDto>>(movies);
        //}
    }
}
