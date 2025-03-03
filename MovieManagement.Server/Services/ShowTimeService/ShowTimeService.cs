using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public class ShowTimeService : IShowTimeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShowTimeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ShowtimeDto> CreateShowtimeAsync(ShowtimeDto showtime)
        {
            var newShowtime = _mapper.Map<ShowTime>(showtime);
            var createdShowtime = _unitOfWork.ShowtimeRepository.CreateAsync(newShowtime);
            return _mapper.Map<ShowtimeDto>(createdShowtime);
        }

        public async Task<bool> DeleteShowtimeAsync(Guid movieId, Guid roomId)
        {
            return await _unitOfWork.ShowtimeRepository.DeleteComposeAsync(movieId, roomId);
        }

        public async Task<IEnumerable<ShowtimeDto>> GetAllShowtimeAsync()
        {
            var showtimes = await _unitOfWork.ShowtimeRepository.GetAllAsync();
            return _mapper.Map<List<ShowtimeDto>>(showtimes);
        }
        public async Task<IEnumerable<ShowtimeDto>> GetShowtimePageAsync(int page, int pageSize)
        {
            var showtimes = await _unitOfWork.ShowtimeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<ShowtimeDto>>(showtimes);
        }
        public async Task<ShowtimeDto> GetShowtimeByComposeIdAsync(Guid movieId, Guid roomId)
        {
            var showtime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
            //if(ticket == null)
            //{
            //    throw new Exception("Show time not found");
            //}
            return _mapper.Map<ShowtimeDto>(showtime);  
        }

        public async Task<ShowtimeDto> UpdateShowtimeAsync(Guid movieId, Guid roomId, ShowtimeDto showtime)
        {
            var existingShowTime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
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
