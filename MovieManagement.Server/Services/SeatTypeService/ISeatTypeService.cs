using MovieManagement.Server.Models.DTOs;

namespace MovieManagement.Server.Services.SeatTypeService
{
    public interface ISeatTypeService
    {

        Task<SeatTypeDto> CreateAsync(SeatTypeDto seatType);
        Task<SeatTypeDto> GetByIdAsync(Guid SeatTypeId);
        Task<IEnumerable<SeatTypeDto>> GetPageAsync(int page, int pageSize);
        Task<IEnumerable<SeatTypeDto>> GetAllAsync();
        Task<SeatTypeDto> UpdateAsync(Guid SeatTypeId, SeatTypeDto seatType);
        Task<bool> DeleteAsync(Guid SeatTypeId);


    }
}
