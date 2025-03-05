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

        public async Task<ShowTimeDto> CreateAsync(ShowTimeDto showtime)
        {
            var newShowTime = new ShowTime()
            {
                MovieId = showtime.MovieId,
                StartTime = showtime.StartTime,
                RoomId = showtime.RoomId
            };

            try
            {
                var createdShowTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.CreateAsync(newShowTime));
                return createdShowTime;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into Database", ex);
            }
        }

        public async Task<bool> DeleteAsync(Guid movieId, Guid roomId)
        {
            try
            {
                var showTime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
                if (showTime == null)
                {
                    throw new NotFoundException("ShowTime does not found!");
                }
                return await _unitOfWork.ShowtimeRepository.DeleteComposeAsync(movieId, roomId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<ShowTimeDto>> GetAll()
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
        public async Task<ShowTimeDto> GetByComposeId(Guid movieId, Guid roomId)
        {
            try
            {
                var showTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId));
                if (showTime == null)
                {
                    throw new NotFoundException("ShowTime does not found!");
                }
                return showTime;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<ShowTimeDto> UpdateAsync(Guid movieId, Guid roomId, ShowTimeDto showtime)
        {
            try
            {
                if (showtime == null)
                {
                    throw new ArgumentNullException("ShowTime", "ShowTime is null");
                }

                var existingShowTime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
                if (existingShowTime == null)
                {
                    throw new NotFoundException("ShowTime does not found!");
                }

                existingShowTime.StartTime = showtime.StartTime;
                existingShowTime.MovieId = showtime.MovieId;
                existingShowTime.StartTime = showtime.StartTime;

                var updatedShowTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.UpdateAsync(existingShowTime));
                return updatedShowTime;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing with database.", ex);
            }
        }

   
    }
}
