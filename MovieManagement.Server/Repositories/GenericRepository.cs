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
        public List<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }
        public T GetById(Guid id)
        {
            return _context.Set<T>().Find(id);
        }
        public List<T> GetPage(int page, int pageSize)
        {
            return _context.Set<T>().Skip(page * pageSize).Take(pageSize).ToList();
        }
        public T GetByComposeId(Guid id, Guid id2)
        {
            return _context.Set<T>().Find(id, id2);
        }
        public T Create(T entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
            return entity;
        }
        public T Update(T entity)
        {
            _context.Attach(entity).State = EntityState.Modified;
            _context.SaveChanges();
            return entity;
        }
        public bool Delete(Guid id)
        {
            var entity = GetById(id);
            if (entity == null) return false;
            _context.Remove(entity);
            _context.SaveChangesAsync();
            return true;
        }
        public bool Delete(T Entity)
        {
            _context.Remove(Entity);
            _context.SaveChangesAsync();
            return true;
        }
        public bool DeleteCompose(Guid id, Guid id2)
        {
            var entity = GetByComposeId(id, id2);
            if (entity == null) return false;
            _context.Remove(entity);
            _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }
        public async Task<T> GetByIdAsync(Guid id)
        {
            return await _context.Set<T>().FindAsync(id);
        }
        public async Task<List<T>> GetPageAsync(int page, int pageSize)
        {
            return await _context.Set<T>().Skip((page-1) * pageSize).Take(pageSize).ToListAsync();
        }
        public async Task<T> GetByComposeIdAsync(Guid id, Guid id2)
        {
            return await _context.Set<T>().FindAsync(id, id2);
        }
        public async Task<T> CreateAsync(T entity)
        {
            _context.AddAsync(entity);
            _context.SaveChangesAsync();
            return entity;
        }
        public async Task<T> UpdateAsync(T entity)
        {
            _context.Attach(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) return false;
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(T Entity)
        {
            _context.Remove(Entity);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteComposeAsync(Guid id, Guid id2)
        {
            var entity = await GetByComposeIdAsync(id, id2);
            if (entity == null) return false;
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
