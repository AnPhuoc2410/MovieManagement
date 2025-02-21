using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using System.Net.Sockets;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public class ShowTimeService : IShowTimeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShowTimeService(IUnitOfWork unitOfWork, IMapper mapper)
        {

            unitOfWork = _unitOfWork;
            mapper = _mapper;

        }

        public async Task<ShowtimeDto> CreateShowTime(ShowtimeDto showtime)
        {
            var newShowTime = new Showtime() 
            {
                MovieId = showtime.MovieId,
                StartTime = showtime.StartTime,
                RoomId = showtime.RoomId
            };

            return _mapper.Map<ShowtimeDto>(await _unitOfWork.ShowtimeRepository.CreateAsync(newShowTime));
        }

        public Task<bool> DeleteShowtime(Guid id)
        {
            return _unitOfWork.ShowtimeRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ShowtimeDto>> GetAllShowtime()
        {
            return _mapper.Map<List<ShowtimeDto>>(await _unitOfWork.ShowtimeRepository.GetAllAsync());
        }

        public async Task<ShowtimeDto> GetShowtime(Guid id)
        {
            var ticket = await _unitOfWork.ShowtimeRepository.GetByIdAsync(id);
            if(ticket == null)
            {
                throw new Exception("Show time not found");
            }
            return _mapper.Map<ShowtimeDto>(ticket);  
        }

        public async Task<ShowtimeDto> UpdateShowTime(Guid id, ShowtimeDto showtime)
        {
            var existingShowTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(id);
            if (existingShowTime == null)
            {
                throw new Exception("Show time not found");
            }
            existingShowTime.StartTime = showtime.StartTime;
            existingShowTime.MovieId = showtime.MovieId;
            existingShowTime.StartTime = showtime.StartTime;
            var updatedShowTime = await _unitOfWork.ShowtimeRepository.UpdateAsync(existingShowTime);
            return _mapper.Map<ShowtimeDto>(updatedShowTime);
        }

    }
}
