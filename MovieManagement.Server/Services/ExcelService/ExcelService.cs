using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Repositories;
using OfficeOpenXml;

namespace MovieManagement.Server.Services.ExcelService
{
    public class ExcelService : IExcelService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ExcelService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public string ExportToExcel()
        {
            string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            string date = DateTime.Now.ToString("dd/MM/yyyy", new System.Globalization.CultureInfo("vie-vi"));
            string fileName = $"Thong ke - {date}.xlsx";
            string filePath = Path.Combine(desktopPath, date);

            List<BillDto> bill = new List<BillDto>();
            bill = _mapper.Map<List<BillDto>>(_unitOfWork.BillRepository.GetAll());

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Hóa đơn");

            }

            return null;
        }
    }
}
