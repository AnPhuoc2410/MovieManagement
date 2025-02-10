using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSK.Repository.Base
{
    public class GenericRepository<T> where T : class
    {
        protected SWP391FengShuiKoiSystemContext _context;

        public GenericRepository() => _context ??= new SWP391FengShuiKoiSystemContext();

        public GenericRepository(SWP391FengShuiKoiSystemContext context) => _context = context;

        public List<T> Shuffle(List<T> list)
        {
            Random rng = new Random();

            int n = list.Count;

            for (int i = n - 1; i > 0; i--)
            {
                int j = rng.Next(0, i + 1);
                // Swap list[i] with list[j]
                T temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
            return list;
        }


        public List<T> GetAll()
        {
            return _context.Set<T>().ToList();
            //return _context.Set<T>().AsNoTracking().ToList();
        }

        public List<T> GetPage(int pageIndex, int pageSize)
        {
            return _context.Set<T>().Skip(pageIndex*pageSize).Take(pageSize).ToList();
            //return _context.Set<T>().AsNoTracking().ToList();
        }

        public void Create(T entity)
        {
            _context.Add(entity);
            _context.SaveChanges();
        }

        public void Update(T entity)
        {
            var tracker = _context.Attach(entity);
            tracker.State = EntityState.Modified;
            _context.SaveChanges();
        }

        public bool Remove(T entity)
        {
            _context.Remove(entity);
            _context.SaveChanges();
            return true;
        }

        public T GetById(int id)
        {
            return _context.Set<T>().Find(id);
        }

        public T GetById(string code)
        {
            return _context.Set<T>().Find(code);
        }

        public T GetById(Guid code)
        {
            return _context.Set<T>().Find(code);
        }
        

        public async Task<int> CountAsync(Expression<Func<T, bool>> filter)
        {
            return await _context.Set<T>().CountAsync(filter);
        }

        #region Asynchronous

        public async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<List<T>> GetPageAsync(int pageIndex, int pageSize)
        {
            return await _context.Set<T>().Skip(pageIndex * pageSize).Take(pageSize).ToListAsync();
            //return _context.Set<T>().AsNoTracking().ToList();
        }
        public async Task<int> CreateAsync(T entity)
        {
            _context.Add(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<T> CreateNewAsync(T entity)
        {
            _context.Add(entity);
            await _context.SaveChangesAsync();
            return await _context.Set<T>().LastAsync();
        }


        public async Task<int> CreateIdentityAsync(T entity)
        {
            var transaction = _context.Database.BeginTransaction();
                try
                {
                    var table = entity.ToString().Split('.').Last();
                    _context.Database.ExecuteSqlRaw($"SET IDENTITY_INSERT [dbo].[{table}] ON");
                    _context.Add(entity);
                    var count = await _context.SaveChangesAsync();
                    _context.Database.ExecuteSqlRaw($"SET IDENTITY_INSERT [dbo].[{table}] OFF");
                    transaction.Commit();
                    return count;
                }
                catch (Exception err)
                {
                    transaction.Rollback();
                    return 0;
                }
        }

        

        public async Task<int> UpdateAsync(T entity)
        {
            var tracker = _context.Attach(entity);
            tracker.State = EntityState.Modified;

            return await _context.SaveChangesAsync();
        }

        public async Task<bool> RemoveAsync(T entity)
        {
            _context.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T> GetByIdAsync(string code)
        {
            return await _context.Set<T>().FindAsync(code);
        }

        public async Task<T> GetByIdAsync(Guid code)
        {
            return await _context.Set<T>().FindAsync(code);
        }

        #endregion


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
