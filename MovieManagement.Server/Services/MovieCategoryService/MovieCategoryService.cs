using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MovieCategoryService
{
    public class MovieCategoryService : IMovieCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        public Task<MovieCategory> CreateAsync(MovieCategory movieCategory)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MovieCategory>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<MovieCategory> GetByIdAsync(Guid ticketId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MovieCategory>> GetPageAsync(int page, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<MovieCategory> UpdateAsync(Guid id, MovieCategory movieCategory)
        {
            throw new NotImplementedException();
        }
    }
}
