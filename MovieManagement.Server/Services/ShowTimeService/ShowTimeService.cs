using AutoMapper;
using MovieManagement.Server.Data;
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

        public async Task<ShowTimeDto> CreateShowTime(ShowTimeDto showtime)
        {
            var newShowTime = new ShowTime() 
            {
                MovieId = showtime.MovieId,
                StartTime = showtime.StartTime,
                RoomId = showtime.RoomId
            };

            return _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.CreateAsync(newShowTime));
        }

        public Task<bool> DeleteShowtime(Guid movieId, Guid roomId)
        {
            return _unitOfWork.ShowtimeRepository.DeleteComposeAsync(movieId, roomId);
        }

        public async Task<IEnumerable<ShowTimeDto>> GetAllShowtime()
        {
            var showtimes = await _unitOfWork.ShowtimeRepository.GetAllAsync();
            return _mapper.Map<List<ShowTimeDto>>(showtimes);
        }

        public async Task<ShowTimeDto> GetShowtime(Guid movieId, Guid roomId)
        {
            var ticket = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
            //if(ticket == null)
            //{
            //    throw new Exception("Show time not found");
            //}
            return _mapper.Map<ShowTimeDto>(ticket);  
        }

        public async Task<ShowTimeDto> UpdateShowTime(Guid movieId, Guid roomId, ShowTimeDto showtime)
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
            return _mapper.Map<ShowTimeDto>(updatedShowTime);
        }

    }
}
