using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<List<TopCategoryResponse.CategoryRevenue>> GetCategoryHaveTicketsSold();

        Task<TopCategoryResponse.Daily> GetCategoryHaveTicketsSoldDaily(DateTime day);
    }
}
