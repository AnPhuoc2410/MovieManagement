using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories;
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
            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<MovieDto> CreateAsync(Guid employeeId, MovieDto movieDto)
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
            movieDto.CategoriesIds.ToList().ForEach(x =>
            {
                var movieCategory = new MovieCategory
                {
                    MovieId = movie.MovieId,
                    CategoryId = x
                };
                _unitOfWork.MovieCategoryRepository.Create(movieCategory);
            });
            var response = _mapper.Map<MovieDto>(movie);
            response.CategoriesIds = movieDto.CategoriesIds;
            return response;
        }

        public async Task<MovieDto> UpdateAsync(Guid movieId, MovieDto movieDto)
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
            var updateMovieCategories = _unitOfWork.MovieCategoryRepository.GetMovieCategoriesByMovieId(updateMovie.MovieId);

            if (updateMovieCategories.Count > 0)
                foreach (var x in updateMovieCategories)
                {
                    await _unitOfWork.MovieCategoryRepository.DeleteAsync(x);
                }

            var updatedMovie = await _unitOfWork.MovieRepository.UpdateAsync(updateMovie);

            movieDto.CategoriesIds.ToList().ForEach(x =>
            {
                var movieCategory = new MovieCategory
                {
                    MovieId = updateMovie.MovieId,
                    CategoryId = x
                };
                _unitOfWork.MovieCategoryRepository.CreateAsync(movieCategory);
            });

            //return _mapper.Map<MovieDto>(updatedMovie);
            var response = _mapper.Map<MovieDto>(updatedMovie);
            response.CategoriesIds = movieDto.CategoriesIds;
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
