using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.SeatTypeService
{
    public interface ISeatTypeService
    {

        Task<SeatTypeDto> CreateSeatTypeAsync(SeatTypeDto seatType);
        Task<SeatTypeDto> GetSeatTypeByIdAsync(Guid SeatTypeId);
        Task<IEnumerable<SeatTypeDto>> GetSeatTypePageAsync(int page, int pageSize);
        Task<IEnumerable<SeatTypeDto>> GetAllSeatTypesAsync();
        Task<SeatTypeDto> UpdateSeatTypeAsync(Guid SeatTypeId, SeatTypeDto seatType);
        Task<bool> DeleteSeatTypeAsync(Guid SeatTypeId);


    }
}
