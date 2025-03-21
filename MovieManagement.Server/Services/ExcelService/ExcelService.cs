using MovieManagement.Server.Models.RequestModel;

namespace MovieManagement.Server.Services.ExcelService
{
    public class ExcelService : IExcelService
    {
        private IExcelService _excelService;

        public ExcelService(IExcelService excelService)
        {
            _excelService = excelService;
        }

        public string ExportToExcel(List<BillReportRequest> data)
        {
            throw new NotImplementedException();
        }
    }
}
