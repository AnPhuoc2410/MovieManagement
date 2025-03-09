using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User> GetByName(string username, string email)
        {
            var groupUser = await (from g in _context.Users
                                   where g.UserName == username && g.Status == 1
                                   group g by g.Email into groupUsers
                                   select new
                                   {
                                       Email = groupUsers.Key,
                                       FirstUser = groupUsers.FirstOrDefault()
                                   }).FirstOrDefaultAsync();

            return groupUser?.FirstUser;
        }
    }
}
