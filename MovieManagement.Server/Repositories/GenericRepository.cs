using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Repositories.IRepositories;

namespace MovieManagement.Server.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        public GenericRepository(AppDbContext context)
        {
            _context = context;
        }
        public T Create(T entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public async Task<T> CreateAsync(T entity)
        {
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public bool Delete(int id)
        {
            var entity = GetById(id);
            if (entity == null) return false;
            _context.Remove(entity);
            _context.SaveChangesAsync();
            return true;
        }

        public bool Delete(string id)
        {
            var entity = GetById(id);
            if (entity == null) return false;
            _context.Remove(entity);
            _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) return false;
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) return false;
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public List<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public T GetById(int id)
        {
            return _context.Set<T>().Find(id);
        }

        public T GetById(string id)
        {
            return _context.Set<T>().Find(id);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T> GetByIdAsync(string id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public List<T> GetPage(int page, int pageSize)
        {
            return _context.Set<T>().Skip(page * pageSize).Take(pageSize).ToList();
        }

        public async Task<List<T>> GetPageAsync(int page, int pageSize)
        {
            return await _context.Set<T>().Skip(page * pageSize).Take(pageSize).ToListAsync();
        }

        public T Update(T entity)
        {
            _context.Attach(entity).State = EntityState.Modified;
            _context.SaveChanges();
            return entity;
        }

        public async Task<T> UpdateAsync(T entity)
        {
            _context.Attach(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
