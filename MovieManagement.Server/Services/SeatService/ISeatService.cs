using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.SeatService
{
    public interface ISeatService
    {

        public Task<IEnumerable<SeatDto>> GetAllSeatAsync();
        public Task<IEnumerable<SeatDto>> GetSeatPageAsync(int page, int pageSize);
        public Task<SeatDto> GetSeatByIdAsync(Guid seatId);
        public Task<SeatDto> CreateSeatAsync(SeatDto seat);
        public Task<SeatDto> UpdateSeatAsync(Guid seatId, SeatDto seat);
        public Task<bool> DeleteSeatAsync(Guid seatId);

        public Task<bool> CreateByRoomIdAsync(Guid roomId, Guid SeatTypeId);

        public Task<IEnumerable<SeatDto>> UpdateByList(List<Guid> list, bool isActived);
        public Task<IEnumerable<SeatDto>> UpdateTypeByList(List<Guid> list, Guid seatTypeId);
        public Task<bool> AddRowByRoomId(Guid roomId, Guid seatTypeId);
        public Task<bool> AddColumnByRoomId(Guid roomId, Guid seatTypeId);
        public Task<IEnumerable<SeatDto>> GetByRoomId(Guid roomId);
        public Task<bool> DeleteByRoomId(Guid roomId);


    }
}
