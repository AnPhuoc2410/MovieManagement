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

                int lastRow = worksheet.Dimension == null ? 3 : worksheet.Dimension.End.Row + 1;


                // Thiết kế header
                worksheet.Cells["A1:C2"].Merge = true;
                worksheet.Cells["A1"].Value = "Tổng doanh thu từng ngày";
                worksheet.Cells["A1:C2"].Style.Font.Bold = true;
                worksheet.Cells["A1:C2"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells["A1:C2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Cells["A1:C2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells["A1:C2"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells["A1:C2"].Style.Fill.BackgroundColor.SetColor(Color.Orange);

                // Thiết kế table content
                worksheet.Cells["A3"].Value = "Ngày";
                worksheet.Cells["B3"].Value = "Số vé";
                worksheet.Cells["C3"].Value = "Doanh thu";
                worksheet.Cells["A3:C3"].Style.Font.Bold = true;
                worksheet.Cells["A3:C3"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells["A3:C3"].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(219, 238, 244));

                worksheet.Cells["A:A"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells["A:A"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                worksheet.Cells["A:A"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells["A:A"].Style.Numberformat.Format = "dd/MM/yyyy";

                worksheet.Cells["B:B"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells["B:B"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Cells["B:B"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                worksheet.Cells["C:C"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells["C:C"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                worksheet.Cells["C:C"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells["C:C"].Style.Numberformat.Format = "#,##0.00 ₫";

                // Thiết kế dữ liệu tổng
                //worksheet.Cells[$"A{lastRow}"].Value = "Tổng doanh thu:";
                //worksheet.Cells[$"A{lastRow}"].Style.Font.Bold = true;
                //worksheet.Cells[$"A{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                //worksheet.Cells[$"A{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                // In ra doanh thu
                //worksheet.Cells[$"C{lastRow}"].Formula = $"SUM(C4:C{lastRow - 1})";
                //worksheet.Cells[$"C{lastRow}"].Style.Font.Bold = true;
                //worksheet.Cells[$"C{lastRow}"].Style.Numberformat.Format = "#,##0.00 ₫"; // Định dạng tiền tệ
                //worksheet.Cells[$"C{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                //worksheet.Cells[$"C{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                //worksheet.Cells["A1:C1"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                //worksheet.Cells["A1:C1"].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#B4C7E7"));


                // Định dạng màu nền cho hàng tổng
                //worksheet.Cells[$"B{lastRow}:C{lastRow}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                //worksheet.Cells[$"B{lastRow}:C{lastRow}"].Style.Fill.BackgroundColor.SetColor(Color.LightGray);

                worksheet.Cells.AutoFitColumns();

                return package.GetAsByteArray();
            }
        }
    }
}
