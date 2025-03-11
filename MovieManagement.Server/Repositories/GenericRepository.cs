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
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
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

        // Soft delete by ID (synchronous)
        public bool SoftDelete(Guid id)
        {
            var entity = _context.Set<T>().Find(id);
            if (entity == null) return false;

            // Assuming there is a 'Status' property on the entity
            var statusProperty = entity.GetType().GetProperty("Status");
            if (statusProperty != null)
            {
                statusProperty.SetValue(entity, 0); // Set the status to 0 (soft delete)
                _context.SaveChanges(); // Synchronous save
                return true;
            }

            return false;
        }

        // Soft delete by entity (synchronous)
        public bool SoftDelete(T entity)
        {
            var statusProperty = entity.GetType().GetProperty("Status");
            if (statusProperty != null)
            {
                statusProperty.SetValue(entity, 0); // Set the status to 0 (soft delete)
                _context.SaveChanges(); // Synchronous save
                return true;
            }

            return false;
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity == null) return false;

            var statusProperty = entity.GetType().GetProperty("Status");
            if (statusProperty != null)
            {
                statusProperty.SetValue(entity, 0); // Set the status to 0 (soft delete)
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        // Asynchronous soft delete by entity
        public async Task<bool> SoftDeleteAsync(T entity)
        {
            var statusProperty = entity.GetType().GetProperty("Status");
            if (statusProperty != null)
            {
                statusProperty.SetValue(entity, 0); // Set the status to 0 (soft delete)
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        #region Separating asigned entities and save operators        

        public void PrepareCreate(T entity)
        {
            _context.Add(entity);
        }

        public void PrepareUpdate(T entity)
        {
            var tracker = _context.Attach(entity);
            tracker.State = EntityState.Modified;
        }

        public void PrepareRemove(T entity)
        {
            _context.Remove(entity);
        }

        public int Save()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        #endregion Separating asign entity and save operators

    }
}
