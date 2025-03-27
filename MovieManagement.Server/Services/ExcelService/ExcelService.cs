using AutoMapper;
using Hangfire.MemoryStorage.Database;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using MovieManagement.Server.Repositories;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace MovieManagement.Server.Services.ExcelService
{
    public class ExcelService : IExcelService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExcelService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public byte[] ExportToExcel()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Lấy ra danh sách doanh thu theo ngày
            var dailyStatistics = _unitOfWork.BillRepository.GetDailyStatisticsAsync();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Doanh thu theo ngày");

                // Design header
                worksheet.Cells["A1:C2"].Merge = true;
                worksheet.Cells["A1"].Value = "Tổng doanh thu từng ngày";
                worksheet.Cells["A1:C2"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells["A1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Cells["A1"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells["A1:C1"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells["A1:C1"].Style.Fill.BackgroundColor.SetColor(Color.Orange);

                // Design table header
                worksheet.Cells["A3"].Value = "Ngày";
                worksheet.Cells["B3"].Value = "Số vé";
                worksheet.Cells["C3"].Value = "Doanh thu";
                worksheet.Cells["A3:C3"].Style.Font.Bold = true;

                worksheet.Cells.AutoFitColumns();

                return package.GetAsByteArray();
            }
        }
    }
}
