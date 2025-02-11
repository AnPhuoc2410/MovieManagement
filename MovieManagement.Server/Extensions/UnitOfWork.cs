//using MovieManagement.Server.Repositories;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace MovieManagement.Server.Extensions
//{
//    public class UnitOfWork
//    {
//        private readonly SWP391FengShuiKoiSystemContext _context;
//        private NhanVienRepository _nhanvienRepository;

//        public UnitOfWork() => _context ??= new SWP391FengShuiKoiSystemContext();


//        public NhanVienRepository NhanVienRepository
//        {
//            get { return _nhanvienRepository ??= new UserRepository(_context); }
//        }

//        public async Task<int> SaveChangesAsync()
//        {
//            return await _context.SaveChangesAsync();
//        }
//    }
//}