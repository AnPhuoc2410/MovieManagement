namespace MovieManagement.Server.Repositories.IRepositories
{
    public interface IGenericRepository<T> where T : class
    {
        /// <summary>
        /// Sử dụng IEnumerable sẽ cho phép duyệt qua các object có trong database
        /// Nhưng sẽ cần phải truy vấn dữ liệu vào trong db để lấy.
        /// Nếu một số trường hợp gây ra lỗi đóng db sớm hơn dự tính sẽ gây ra lỗi "Disposed"
        /// 
        /// Tuy nhiên, IEnumerable giúp cho chương trình truy xuất dữ liệu nhanh chóng
        /// Và tránh việc thay đổi dữ liệu từ bên ngoài
        /// 
        /// IEnumerable sẽ không trả về List mà chỉ là duyệt qua các phần tử và in ra.
        /// </summary>

        /// <summary>
        /// Sử dụng List sẽ lấy các dữ liệu trong db và lưu vào trong bộ nhớ (RAM)
        /// Vì vậy, khi db bị đóng sớm sẽ không gây ra lỗi "Disposed"
        /// 
        /// Khi dùng List sẽ gây ra trường hợp bị mất dữ liệu trong quá trình sử lý.
        /// </summary>

        //Synchronous Interfaces
        T GetById(int id);
        T GetById(string id);
        T GetById(Guid id);

        /// <summary>
        /// Dùng List ở đây vì để lấy dữ liệu đưa vào trong RAM
        /// Tránh việc bị Disposed.
        /// 
        /// P/S: Lúc đầu sử dụng IEnumerable, bây giờ sử lại thành List
        /// Là do IEnumerable sử dụng cho các dữ liệu rất lớn
        /// Và cần truy xuất dữ liệu cho các LINQ kế tiếp.
        /// </summary>
        List<T> GetAll();
        T Create(T entity);
        T Update(T entity);
        bool Delete(int id);
        bool Delete(string id);
        bool Delete(Guid id);

        /// <summary>
        /// Dùng List cho việc phân trang vì dữ liệu sau khi lấy sẽ load lên RAM
        /// Tránh cho việc gập lỗi Disposed
        /// </summary>
        /// <param name="page">Trang số bao nhiêu</param>
        /// <param name="pageSize">Trang có kích thước như thế nào (bao nhiêu object)</param>
        /// <returns>Trả về một list</returns>
        List<T> GetPage(int page, int pageSize);

        //Asynchronous Interfaces
        Task<T> GetByIdAsync(int id);
        Task<T> GetByIdAsync(string id);
        Task<T> GetByIdAsync(Guid id);
        Task<List<T>> GetAllAsync();
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(string id);
        Task<bool> DeleteAsync(Guid id);
        Task<List<T>> GetPageAsync(int page, int pageSize);
    }
}
