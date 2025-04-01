using AutoMapper;
using Microsoft.Extensions.Localization;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Resources;
using System.Globalization;
using static MovieManagement.Server.Models.Enums.UserEnum;

namespace MovieManagement.Server.Services.MovieService
{
    public class MovieService : IMovieService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer _localizerMovieTranslate;
        private readonly IStringLocalizer _localizerCategoryTranslate;
        public MovieService(IUnitOfWork unitOfWork, IMapper mapper, IStringLocalizerFactory factory)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _localizerMovieTranslate = factory.Create("MovieResource", typeof(MovieResource).Assembly.FullName);
            _localizerCategoryTranslate = factory.Create("CategoryResource", typeof(CategoryResource).Assembly.FullName);
        }

        public async Task<IEnumerable<MovieDto>> GetAllMoviesAsync()
        {
            var movies = _mapper.Map<List<MovieDto>>(await _unitOfWork.MovieRepository.GetAllAsyncDeletedFalse());
            if (movies == null)
            {
                throw new NotFoundException("Movies not found!");
            }
            return movies;
        }

        public async Task<IEnumerable<MoviePreview>> GetPageAsync(int page, int pageSize)
        {
            if (page < 0 || pageSize < 1)
            {
                throw new BadRequestException("Page and PageSize is invalid");
            }
            var movies = await _unitOfWork.MovieRepository.GetMovieByPage(page, pageSize);

            if (movies == null)
            {
                throw new NotFoundException("Movies not found!");
            }

            List<Movie> translationMovies = new List<Movie>();

            foreach(var movie in movies)
            {
                movie.MovieName = _localizerMovieTranslate[movie.MovieName];
                movie.Content = _localizerMovieTranslate[movie.Content];
                translationMovies.Add(movie);
            }

            return _mapper.Map<IEnumerable<MoviePreview>>(translationMovies);
        }

        public async Task<MovieDto> GetMovieByIdAsync(Guid movieId)
        {
            if (movieId == Guid.Empty)
            {
                throw new BadRequestException("MovieId is invalid");
            }
            var movie = await _unitOfWork.MovieRepository.GetMovieById(movieId);
            if (movie == null)
            {
                throw new NotFoundException("Movie does not found!");
            }

            movie.MovieName = _localizerMovieTranslate[movie.MovieName];
            movie.Content = _localizerMovieTranslate[movie.Content];

            var response = _mapper.Map<MovieDto>(movie);
            var movieCategories = _unitOfWork.MovieCategoryRepository.GetMovieCategoriesByMovieId(movieId);
            foreach (var movieCategory in movieCategories)
            {
                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(movieCategory.CategoryId);
                category.Name = _localizerCategoryTranslate[category.Name];
                response.Categories.Add(_mapper.Map<CategoryDto>(category));
            }
            return response;
        }

        public async Task<MovieDto> CreateMovieAsync(Guid employeeId, MovieRequest movieRequest)
        {
            if (employeeId == Guid.Empty)
            {
                throw new BadRequestException("EmployeeId is invalid");
            }
            var existingEmployee = await _unitOfWork.UserRepository.GetByIdAsync(employeeId);
            if (existingEmployee == null)
            {
                throw new NotFoundException("Employee cannot found!");
            }
            if (existingEmployee.Role == Role.Member)
            {
                throw new BadRequestException("Employee is not member");
            }

            movieRequest.UserId = employeeId;
            var movie = _mapper.Map<Movie>(movieRequest);
            movie.PostDate = DateTime.Now;
            var response = _mapper.Map<MovieDto>(await _unitOfWork.MovieRepository.CreateAsync(movie));
            //var response = _mapper.Map<MovieDto>(movie);

            if (movieRequest.CategoriesIds.Count != 0)
                foreach (var categoryId in movieRequest.CategoriesIds)
                {
                    var movieCategory = new MovieCategory
                    {
                        MovieId = response.MovieId.Value,
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
            if (movieId == Guid.Empty)
            {
                throw new BadRequestException("MovieId is invalid");
            }

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
            var existingMovie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
            if (existingMovie == null)
                throw new NotFoundException("Movie cannot found!");
            return await _unitOfWork.MovieRepository.DeleteAsync(movieId);
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesNowShowing(int page, int pageSize)
        {
            if (page < 0 || pageSize < 1)
            {
                throw new BadRequestException("Page and PageSize is invalid");
            }
            var moviesNowShowing = await _unitOfWork.MovieRepository.GetMoviesNowShowing(page, pageSize);

            if (moviesNowShowing == null)
            {
                throw new NotFoundException("Movies not found!");
            }

            List<Movie> translationMovies = new List<Movie>();

            foreach(var movie in moviesNowShowing)
            {
                movie.MovieName = _localizerMovieTranslate[movie.MovieName];
                movie.Content = _localizerMovieTranslate[movie.Content];
                translationMovies.Add(movie);
            }

            return _mapper.Map<IEnumerable<MoviePreview>>(translationMovies);
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesUpComing(int page, int pageSize)
        {
            if (page < 0 || pageSize < 1)
            {
                throw new BadRequestException("Page and PageSize is invalid");
            }
            var moviesUpComing = await _unitOfWork.MovieRepository.GetMoviesUpComing(page, pageSize);
            if (moviesUpComing == null)
            {
                throw new NotFoundException("Movies not found!");
            }

            List<Movie> translationMovies = new List<Movie>();

            foreach(var movie in moviesUpComing)
            {
                movie.MovieName = _localizerMovieTranslate[movie.MovieName];
                movie.Content = _localizerMovieTranslate[movie.Content];
                translationMovies.Add(movie);
            }

            return _mapper.Map<IEnumerable<MoviePreview>>(translationMovies);
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesByNameRelativePage(string name, int page, int pageSize)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new BadRequestException("Name is invalid");
            }
            if (page < 0 || pageSize < 1)
            {
                throw new BadRequestException("Page and PageSize is invalid");
            }
            var movies = await _unitOfWork.MovieRepository.GetMoviesByNameRelativePage(name, page, pageSize);

            if (movies == null)
            {
                throw new NotFoundException("Movies not found!");
            }

            List<Movie> translationMovies = new List<Movie>();

            foreach (var movie in movies)
            {
                movie.MovieName = _localizerMovieTranslate[movie.MovieName];
                movie.Content = _localizerMovieTranslate[movie.Content];
                translationMovies.Add(movie);
            }

            return _mapper.Map<IEnumerable<MoviePreview>>(translationMovies);
        }

        public async Task<MovieDto> SetMovieDeleted(Guid movieId)
        {
            if (movieId == Guid.Empty)
            {
                throw new BadRequestException("MovieId is invalid");
            }
            var movie = await _unitOfWork.MovieRepository.SetMovieDeleted(movieId);
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<IEnumerable<MovieDto>> GetMoviesByCategory(Guid categoryId, int page, int pageSize)
        {
            if (categoryId == Guid.Empty)
            {
                throw new BadRequestException("CategoryId is invalid");
            }
            if (page < 0 || pageSize < 1)
            {
                throw new BadRequestException("Page and PageSize is invalid");
            }
            var movies = await _unitOfWork.MovieRepository.GetMoviesByCategory(categoryId, page, pageSize);

            if (movies == null)
            {
                throw new NotFoundException("Movies not found!");
            }

            List<Movie> translationMovies = new List<Movie>();

            foreach (var movie in movies)
            {
                movie.MovieName = _localizerMovieTranslate[movie.MovieName];
                movie.Content = _localizerMovieTranslate[movie.Content];
                translationMovies.Add(movie);
            }

            return _mapper.Map<IEnumerable<MovieDto>>(translationMovies);
        }

        public async Task<IEnumerable<MoviePreview>> GetMoviesByNameRelative(string searchValue)
        {
            if (string.IsNullOrEmpty(searchValue))
            {
                throw new BadRequestException("Search value is invalid");
            }
            var movies = await _unitOfWork.MovieRepository.GetMoviesByNameRelative(searchValue);

            if (movies == null)
            {
                throw new NotFoundException("Movies not found!");
            }

            List<Movie> translationMovies = new List<Movie>();

            foreach (var movie in movies)
            {
                movie.MovieName = _localizerMovieTranslate[movie.MovieName];
                movie.Content = _localizerMovieTranslate[movie.Content];
                translationMovies.Add(movie);
            }

            return _mapper.Map<IEnumerable<MoviePreview>>(translationMovies);
        }
    }
}
