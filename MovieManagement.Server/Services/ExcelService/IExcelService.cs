using MovieManagement.Server.Models.RequestModel;

namespace MovieManagement.Server.Services.ExcelService
{
    public interface IExcelService
    {
        Task<byte[]> ExportToExcel();
    }
}
