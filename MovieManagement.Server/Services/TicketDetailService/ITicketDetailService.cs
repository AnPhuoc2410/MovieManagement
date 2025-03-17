using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public interface ITicketDetailService
    {
        Task<TicketDetailDto> CreateTicketDetailAsync(TicketDetailDto ticketDetail);
        Task<TicketDetailDto> GetTicketDetailByIdAsync(Guid ticketId);
        Task<IEnumerable<TicketDetailDto>> GetTicketDetailPageAsync(int  page, int pageSize);
        Task<IEnumerable<TicketDetailDto>> GetAllTicketDetailsAsync();
        Task<TicketDetailDto> UpdateTicketDetailAsync(Guid id, TicketDetailDto ticketDetail);
        Task<bool> DeleteTicketDetailAsync(Guid id);

        Task<IEnumerable<TicketDetailResponseModel>> GetTicketByShowTimeId(Guid showTimeId);
        Task<IEnumerable<TicketDetailResponseModel>> UpdateTicketToPending(List<TicketDetailRequest> Tickets);

        Task<IEnumerable<PurchasedTicketResponse>> GetPurchasedTicketsByBillId(Guid billId);
    }
}
