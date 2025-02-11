using MovieManagement.Server.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieManagement.Server.Repositories
{
    public class NhanVienRepository : INhanVienRepository
    {
        private readonly List<NhanVien> _nhanViens = new();

        public Task<IEnumerable<NhanVien>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<NhanVien>>(_nhanViens);
        }

        public Task<NhanVien> GetByIdAsync(string maNhanVien)
        {
            var nhanVien = _nhanViens.FirstOrDefault(nv => nv.MaNhanVien == maNhanVien);
            return Task.FromResult(nhanVien);
        }

        public Task AddAsync(NhanVien nhanVien)
        {
            _nhanViens.Add(nhanVien);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(NhanVien nhanVien)
        {
            var existingNhanVien = _nhanViens.FirstOrDefault(nv => nv.MaNhanVien == nhanVien.MaNhanVien);
            if (existingNhanVien != null)
            {
                _nhanViens.Remove(existingNhanVien);
                _nhanViens.Add(nhanVien);
            }
            return Task.CompletedTask;
        }

        public Task DeleteAsync(string maNhanVien)
        {
            var nhanVien = _nhanViens.FirstOrDefault(nv => nv.MaNhanVien == maNhanVien);
            if (nhanVien != null)
            {
                _nhanViens.Remove(nhanVien);
            }
            return Task.CompletedTask;
        }
    }
}