using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MovieCategoryService
{
    public class MovieCategoryService : IMovieCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MovieCategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<MovieCategory> CreateMovieCategoryAsync(MovieCategory movieCategory)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteMovieCategoryAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MovieCategory>> GetAllMovieCategoryAsync()
        {
            throw new NotImplementedException();
        }

        public Task<MovieCategory> GetMovieCategoryByIdAsync(Guid ticketId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MovieCategory>> GetMovieCategoryPageAsync(int page, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<MovieCategory> UpdateMovieCategoryAsync(Guid id, MovieCategory movieCategory)
        {
            throw new NotImplementedException();
        }
    }
}
