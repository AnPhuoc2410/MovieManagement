using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
       Task<User> GetByName(string username, string email);
    }

}
