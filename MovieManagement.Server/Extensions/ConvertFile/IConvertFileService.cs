using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Extensions.ConvertFile
{
    public interface IConvertFileService
    {
        string GenerateHtmlFromPurchasedTicket(PurchasedTicketResponse purchasedTicket);
        string GenerateHtmlFromBillReportTemplate(TicketBillResponse ticket);
        string GenerateHtmlFromBillReport(BillReportRequest billReport);

        string GenerateImageFromHTML(string htmlContent);
    }
}
