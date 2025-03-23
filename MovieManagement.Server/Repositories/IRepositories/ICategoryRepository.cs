using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        public Task<List<TopCategoryResponse.CategoryRevenue>> GetCategoryHaveTicketsSold();
    }
}
