using DinkToPdf;
using Microsoft.AspNetCore.Html;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
using System.Drawing;
using System.Text;

namespace MovieManagement.Server.Extensions.ConvertFile
{
    public class ConvertFileService : IConvertFileService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ConvertFileService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public string GenerateHtmlFromPurchasedTicket(PurchasedTicketResponse purchasedTicket)
        {
            string templatePath = "./Templates/PurchasedTicketTemplate.html";
            string htmlContent = File.ReadAllText(templatePath, Encoding.UTF8);
            htmlContent = htmlContent
                .Replace("{{MovieImage}}", purchasedTicket.MovieImage)
                .Replace("{{MovieName}}", purchasedTicket.MovieImage)
                .Replace("{{Categories}}", purchasedTicket.MovieImage)
                .Replace("{{StartDay}}", purchasedTicket.MovieImage)
                .Replace("{{StartTime}}", purchasedTicket.MovieImage)
                .Replace("{{RoomName}}", purchasedTicket.MovieImage)
                .Replace("{{AtColumn}}", purchasedTicket.MovieImage)
                .Replace("{{AtRow}}", purchasedTicket.MovieImage)
                .Replace("{{TypeSeat}}", purchasedTicket.MovieImage);
            return htmlContent;
        }
        public string GenerateHtmlFromBillReportTemplate(TicketBillResponse ticket)
        {
            string ticketList = $@"
                    <div class=""i_row"" style=""display: flex; border-bottom: 1px solid #2f2929;"">
                            <div style=""width: 20%; padding: 12px 5px;"">{ticket.MovieName}</div>
                            <div style=""width: 15%; padding: 12px 5px;"">{ticket.StartDay}</div>
                            <div style=""width: 15%; padding: 12px 5px;"">{ticket.StartTime}</div>
                            <div style=""width: 20%; padding: 12px 5px;"">{ticket.SeatType}</div>
                            <div style=""width: 15%; padding: 12px 5px;"">{ticket.AtRow}{ticket.AtColumn}</div>
                            <div style=""width: 15%; padding: 12px 5px;"">{ticket.Price} VNĐ</div>
                        </div> 
                    ";
            return ticketList;
        }
        public string GenerateHtmlFromBillReport(BillReportRequest billReport, Bill userBill)
        {
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Extensions", "BillReportTemplate", "BillReportTemplate.html");
            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Template file not found: {templatePath}");

            string body = File.ReadAllText(templatePath);

            // Generate ticket list HTML
            decimal total = 0;
            var ticketListHTML = new StringBuilder();
            var ticketDetails = _unitOfWork.BillRepository.GetPurchasedTicketsForBill(userBill.BillId).Result;
            foreach (var ticket in ticketDetails)
            {
                ticketListHTML.Append(GenerateHtmlFromBillReportTemplate(ticket));
                total += ticket.Price;
            }

            // Get discount
            decimal discount = 0;
            if (userBill.PromotionId != null)
            {
                var promotion = _unitOfWork.PromotionRepository.GetByIdAsync(userBill.PromotionId.Value).Result;
                discount = promotion.Discount;
            }

            // Replace placeholders
            body = body
                .Replace("{{CreatedDate}}", billReport.CreatedDate.ToString("MMMM dd, yyyy", new System.Globalization.CultureInfo("en-US")))
                .Replace("{{TicketList}}", ticketListHTML.ToString())
                .Replace("{{Total}}", total.ToString("N0"))
                .Replace("{{Discount}}", discount.ToString("N0"))
                .Replace("{{Amount}}", billReport.Amount.ToString("N0"));

            return body;
        }

        public byte[] ConvertHtmlToPdf(string htmlContent)
        {
            var converter = new BasicConverter(new PdfTools());

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                    ColorMode = ColorMode.Color,
                    Orientation = Orientation.Portrait,
                    PaperSize = PaperKind.A4,
                },
                Objects = {
                    new ObjectSettings()
                    {
                        HtmlContent = htmlContent,
                        WebSettings = { DefaultEncoding = "utf-8" },
                    }
                }
            };
            return converter.Convert(doc);
        }
    }
}
