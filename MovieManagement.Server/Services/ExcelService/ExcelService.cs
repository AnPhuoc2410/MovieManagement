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
using System.Threading.Tasks;

namespace MovieManagement.Server.Services.ExcelService
{
    public class ExcelService : IExcelService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExcelService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        //public class ThongKe
        //{
        //    public int Id { get; set; }
        //    public string Name { get; set; }
        //    public decimal Revenue { get; set; }
        //}
        public async Task<byte[]> ExportToExcel()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // Lấy danh sách doanh thu theo ngày
            List<RevenueResponse.DailyStatistics> statistics = await _unitOfWork.BillRepository.GetDailyStatisticsAsync();

            using (var package = new ExcelPackage())
            {
        //        var data = new List<ThongKe>
        //{
        //    new ThongKe { Id = 1, Name = "Sản phẩm A", Revenue = 100000 },
        //    new ThongKe { Id = 2, Name = "Sản phẩm B", Revenue = 200000 }
        //};

                var worksheet = package.Workbook.Worksheets.Add("Doanh thu theo ngày");

                // Dòng bắt đầu chứa dữ liệu
                int startDataRow = 4;

                for (int i = 0; i < statistics.Count; i++)
                {
                    worksheet.Cells[startDataRow + i, 1].Value = statistics[i].DayTime;
                    worksheet.Cells[startDataRow + i, 2].Value = statistics[i].TotalTickets;
                    worksheet.Cells[startDataRow + i, 3].Value = statistics[i].TotalAmount;
                    worksheet.Cells[startDataRow + i, 3].Style.Numberformat.Format = "#,##0 \"VND\"";
                }
                //for (int i = 0; i < data.Count; i++)
                //{
                //    worksheet.Cells[startDataRow + i, 1].Value = DateTime.Now.AddDays(i).ToString("dd/MM/yyyy");
                //    worksheet.Cells[startDataRow + i, 2].Value = i + 10; // Giả lập số vé
                //    worksheet.Cells[startDataRow + i, 3].Value = data[i].Revenue;
                //    worksheet.Cells[startDataRow + i, 3].Style.Numberformat.Format = "#,##0 \"VND\"";
                //}

                // Xác định dòng cuối cùng để hiển thị tổng doanh thu
                int lastRow = startDataRow + statistics.Count;

                // Thiết lập header
                worksheet.Cells["A1:C2"].Merge = true;
                worksheet.Cells["A1"].Value = "Tổng doanh thu từng ngày";
                worksheet.Cells["A1:C2"].Style.Font.Bold = true;
                worksheet.Cells["A1:C2"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells["A1:C2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Cells["A1:C2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells["A1:C2"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells["A1:C2"].Style.Fill.BackgroundColor.SetColor(Color.Orange);

                // Thiết lập tiêu đề bảng
                worksheet.Cells["A3"].Value = "Ngày";
                worksheet.Cells["B3"].Value = "Số vé";
                worksheet.Cells["C3"].Value = "Doanh thu";
                worksheet.Cells["A3:C3"].Style.Font.Bold = true;
                worksheet.Cells["A3:C3"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells["A3:C3"].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(219, 238, 244));

                worksheet.Cells[$"A4:A{lastRow}"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells[$"A4:A{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                worksheet.Cells[$"A4:A{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells[$"A4:A{lastRow}"].Style.Numberformat.Format = "dd/MM/yyyy";

                worksheet.Cells[$"B4:B{lastRow}"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells[$"B4:B{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Cells[$"B4:B{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                worksheet.Cells[$"C4:C{lastRow}"].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                worksheet.Cells[$"C4:C{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                worksheet.Cells[$"C4:C{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells[$"C4:C{lastRow}"].Style.Numberformat.Format = "#,##0 \"VND\"";

                // Thêm hàng tổng doanh thu
                worksheet.Cells[$"A{lastRow}"].Value = "Tổng doanh thu:";
                worksheet.Cells[$"A{lastRow}"].Style.Font.Bold = true;
                worksheet.Cells[$"A{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Cells[$"A{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                worksheet.Cells[$"C{lastRow}"].Formula = $"SUM(C{startDataRow}:C{lastRow - 1})";
                worksheet.Cells[$"C{lastRow}"].Style.Font.Bold = true;
                worksheet.Cells[$"C{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                worksheet.Cells[$"C{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                worksheet.Cells[$"C{lastRow}"].Style.Numberformat.Format = "#,##0 \"VND\"";

                // Định dạng màu nền hàng tổng doanh thu
                worksheet.Cells[$"A{lastRow}:C{lastRow}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[$"A{lastRow}:C{lastRow}"].Style.Fill.BackgroundColor.SetColor(Color.LightGreen);

                // Tự động căn chỉnh kích thước cột
                worksheet.Cells.AutoFitColumns();

                return package.GetAsByteArray();
            }
        }
    }
}
