using AutoMapper;
using Microsoft.Data.SqlClient;
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

            var newShowTime = _mapper.Map<ShowTime>(showtime);

            var movie = await _unitOfWork.MovieRepository.GetByIdAsync(showtime.MovieId);
            if (movie == null)
            {
                throw new NotFoundException("Movie does not found!");
            }

            var room = await _unitOfWork.RoomRepository.GetByIdAsync(showtime.RoomId);
            if (room == null)
            {
                throw new NotFoundException("Room does not found!");
            }

            newShowTime.ShowTimeId = null;
            newShowTime.StartTime = new DateTime(newShowTime.StartTime.Year, newShowTime.StartTime.Month, newShowTime.StartTime.Day, newShowTime.StartTime.Hour, newShowTime.StartTime.Minute, 0);
            newShowTime.EndTime = newShowTime.StartTime.Add(TimeSpan.FromMinutes(movie.Duration));

            var showTimesByRoom = await _unitOfWork.ShowtimeRepository.GetShowTimeByRoomIdAsync(showtime.RoomId);


            foreach (var st in showTimesByRoom)
            {
                if ((newShowTime.StartTime < st.EndTime && newShowTime.EndTime > st.StartTime) ||
                    (newShowTime.EndTime > st.StartTime && newShowTime.StartTime < st.EndTime))
                {
                    throw new ApplicationException("Unable to create due to other StartTime and EndTime.");
                }
            }

            bool checkStartTime = await _unitOfWork.ShowtimeRepository.CheckStartTimeAsync(newShowTime.StartTime);
            if (!checkStartTime)
            {
                throw new ApplicationException("Unable to create due to other StartTime.");
            }

            var createdShowTime = await _unitOfWork.ShowtimeRepository.CreateAsync(newShowTime);



            return _mapper.Map<ShowTimeDto>(createdShowTime);
        }

        public async Task<bool> DeleteShowtimeAsync(Guid showTimeId)
        {
            try
            {
                var showTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId);
                if (showTime == null)
                {
                    throw new NotFoundException("ShowTime does not found!");
                }
                return await _unitOfWork.ShowtimeRepository.DeleteAsync(showTimeId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }

        public async Task<IEnumerable<ShowTimeDto>> GetAllShowtime()
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
            catch (SqlException ex)
            {
                throw new ApplicationException("Couldn't access into database due to systems error.", ex);
            }
        }


        public async Task<IEnumerable<ShowTimeDto>> GetShowtimePageAsync(int page, int pageSize)
        {
            var showtimes = await _unitOfWork.ShowtimeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<ShowTimeDto>>(showtimes);
        }
        public async Task<ShowTimeDto> GetShowtimeByIdAsync(Guid showTimeId)
        {
            try
            {
                var showTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId));
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

        public async Task<ShowTimeDto> UpdateShowtimeAsync(Guid showTimeId, ShowTimeDto showtime)
        {
            try
            {
                if (showtime == null)
                {
                    throw new ArgumentNullException("ShowTime", "ShowTime is null");
                }

                var existingShowTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId);
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

        public async Task<Dictionary<DateTime, List<ShowTimeDto>>> GetShowTimeFromDateToDate(Guid movieId, DateTime fromDate, DateTime toDate)
        {
            try
            {
                var showTimes = await _unitOfWork.ShowtimeRepository.GetShowTimeFromDateToDate(movieId, fromDate, toDate);
                if (showTimes == null)
                {
                    throw new NotFoundException("Invalid input");
                }
                var dictionary = showTimes.GroupBy(st => st.StartTime.Date)
                    .ToDictionary(g => g.Key, g => _mapper.Map<List<ShowTimeDto>>(g.ToList()));

                return dictionary;
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access into database due to systems error.", ex);
            }
        }


    }
}