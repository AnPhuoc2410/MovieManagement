using Microsoft.AspNetCore.Html;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
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
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Extensions", "ReportTemplate", "TicketTemplate.html");
            string htmlContent = File.ReadAllText(templatePath, Encoding.UTF8);
            htmlContent = htmlContent
                .Replace("{{MovieImage}}", purchasedTicket.MovieImage)
                .Replace("{{MovieName}}", purchasedTicket.MovieName)
                .Replace("{{Categories}}", string.Join(", ", purchasedTicket.MovieCategories))
                .Replace("{{StartDay}}", purchasedTicket.StartDay)
                .Replace("{{StartTime}}", purchasedTicket.StartTime)
                .Replace("{{RoomName}}", purchasedTicket.RoomName)
                .Replace("{{AtColumn}}", purchasedTicket.AtColumn.ToString())
                .Replace("{{AtRow}}", purchasedTicket.AtRow)
                .Replace("{{TypeSeat}}", purchasedTicket.SeatType);
            return htmlContent;
        }
        public string GenerateHtmlFromBillReportTemplate(TicketBillResponse ticket)
        {
            string ticketList = $@"
                    <div class=""i_row"" style=""display: flex ; border-bottom: 1px solid #2f2929;"">
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
        public string GenerateHtmlFromBillReport(BillReportRequest billReport)
        {
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Extensions", "ReportTemplate", "BillReportTemplate.html");
            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Template file not found: {templatePath}");

            string body = File.ReadAllText(templatePath);

            // Generate ticket list HTML
            decimal total = 0;
            var ticketListHTML = new StringBuilder();
            var ticketDetails = _unitOfWork.BillRepository.GetPurchasedTicketsForBill(billReport.BillId).Result;
            foreach (var ticket in ticketDetails)
            {
                ticketListHTML.Append(GenerateHtmlFromBillReportTemplate(ticket));
                total += ticket.Price;
            }

            // Get discount
            decimal discount = 0;
            if (billReport.PromotionId != null)
            {
                var promotion = _unitOfWork.PromotionRepository.GetByIdAsync(billReport.PromotionId.Value).Result;
                discount = promotion.Discount;
            }

            // Replace placeholders
            body = body
                .Replace("{{CreatedDate}}", billReport.CreatedDate.ToString("MMMM dd, yyyy", new System.Globalization.CultureInfo("en-US")))
                .Replace("{{billId}}", billReport.BillId.ToString())
                .Replace("{{TicketList}}", ticketListHTML.ToString())
                .Replace("{{Total}}", total.ToString("N0"))
                .Replace("{{Discount}}", discount.ToString("N0"))
                .Replace("{{PurchasedTicket}}", billReport.Amount.ToString("N0"));

            return body;
        }
    }
}
