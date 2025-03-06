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

        public async Task<ShowTimeDto> CreateShowtimeAsync(ShowTimeDto showtime)
        {
            var newShowtime = _mapper.Map<ShowTime>(showtime);
            newShowtime.ShowTimeId = Guid.NewGuid();
            var createdShowtime = await _unitOfWork.ShowtimeRepository.CreateAsync(newShowtime);
            return _mapper.Map<ShowTimeDto>(createdShowtime);
        }

        public async Task<bool> DeleteAsync(Guid movieId, Guid roomId)
        {
            return await _unitOfWork.ShowtimeRepository.DeleteComposeAsync(movieId, roomId);
        }

        public async Task<IEnumerable<ShowTimeDto>> GetAllShowtimeAsync()
        {
            try
            {
                var showtimes = _mapper.Map<List<ShowTimeDto>>(await _unitOfWork.ShowtimeRepository.GetAllAsync());
                if (showtimes.Count == 0)
                {
                    throw new NotFoundException("ShowTime does not found!");
                }
                return showtimes;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }


        public async Task<IEnumerable<ShowTimeDto>> GetPageAsync(int page, int pageSize)
        {
            var showtimes = await _unitOfWork.ShowtimeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<ShowTimeDto>>(showtimes);
        }
        public async Task<ShowTimeDto> GetShowtimeByComposeIdAsync(Guid movieId, Guid roomId)
        {
            var showtime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
            //if(ticket == null)
            //{
            //    throw new Exception("Show time not found");
            //}
            return _mapper.Map<ShowTimeDto>(showtime);  
        }

        public async Task<ShowTimeDto> UpdateShowtimeAsync(Guid movieId, Guid roomId, ShowTimeDto showtime)
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
