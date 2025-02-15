using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class CategoryDetailRepository : GenericRepository<CategoryDetail>, ICategoryDetailRepository
    {
        public CategoryDetailRepository(AppDbContext context) : base(context)
        {
        }
    }
}
