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

            newShowTime.ShowTimeId = Guid.NewGuid();
            newShowTime.StartTime = new DateTime(newShowTime.StartTime.Year, newShowTime.StartTime.Month, newShowTime.StartTime.Day, newShowTime.StartTime.Hour, newShowTime.StartTime.Minute, 0);
            newShowTime.EndTime = newShowTime.StartTime.Add(TimeSpan.FromMinutes(movie.Duration));

            if (newShowTime.StartTime < DateTime.Now)
            {
                throw new ApplicationException("Unable to create due to StartTime is in the past.");
            }

            if (movie.FromDate.Date > newShowTime.StartTime.Date || newShowTime.StartTime.Date > movie.ToDate.Date)
            {
                throw new ApplicationException("Unable to create due to StartTime is out of range.");
            }

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

            var IsGenerated = CreateTicketByShowTime(createdShowTime.ShowTimeId, room.RoomId);
            if (IsGenerated.Result == 0)
            {
                throw new ApplicationException("Unable to create due to systems error.");
            }

            return _mapper.Map<ShowTimeDto>(createdShowTime);
        }

        private async Task<int> CreateTicketByShowTime(Guid showTimeId, Guid roomId)
        {
            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);
            foreach (var s in seats)
            {
                _unitOfWork.TicketDetailRepository.PrepareCreate(new TicketDetail
                {
                    ShowTimeId = showTimeId,
                    SeatId = s.SeatId,
                    Version = new byte[8],
                    TicketId = Guid.NewGuid()
                });
            }

            return await _unitOfWork.TicketDetailRepository.SaveAsync();
        }

        public async Task<bool> DeleteShowtimeAsync(Guid showTimeId)
        {
            var showTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId);
            if (showTime == null)
            {
                throw new NotFoundException("ShowTime does not found!");
            }
            return await _unitOfWork.ShowtimeRepository.DeleteAsync(showTimeId);
        }

        public async Task<IEnumerable<ShowTimeDto>> GetAllShowtime()
        {
            var showtimes = _mapper.Map<List<ShowTimeDto>>(await _unitOfWork.ShowtimeRepository.GetAllAsync());
            if (showtimes.Count == 0)
            {
                throw new NotFoundException("ShowTime does not found!");
            }
            return showtimes;
        }


        public async Task<IEnumerable<ShowTimeDto>> GetShowtimePageAsync(int page, int pageSize)
        {
            var showtimes = await _unitOfWork.ShowtimeRepository.GetPageAsync(page, pageSize);
            return _mapper.Map<IEnumerable<ShowTimeDto>>(showtimes);
        }
        
        public async Task<ShowTimeDto> GetShowtimeByIdAsync(Guid showTimeId)
        {
            var showTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId));
            if (showTime == null)
            {
                throw new NotFoundException("ShowTime does not found!");
            }
            return showTime;
        }

        public async Task<ShowTimeDto> UpdateShowtimeAsync(Guid showTimeId, ShowTimeDto showtime)
        {
            if (showtime == null)
            {
                throw new ArgumentNullException("ShowTime", "ShowTime is null");
            }

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

            var existingShowTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId);
            if (existingShowTime == null)
            {
                throw new NotFoundException("ShowTime does not found!");
            }


            existingShowTime.StartTime = new DateTime(existingShowTime.StartTime.Year, existingShowTime.StartTime.Month, existingShowTime.StartTime.Day, existingShowTime.StartTime.Hour, existingShowTime.StartTime.Minute, 0);
            existingShowTime.EndTime = existingShowTime.StartTime.Add(TimeSpan.FromMinutes(movie.Duration));

            if (existingShowTime.StartTime < DateTime.Now)
            {
                throw new ApplicationException("Unable to create due to StartTime is in the past.");
            }

            if (movie.FromDate.Date > existingShowTime.StartTime.Date || existingShowTime.StartTime.Date > movie.ToDate.Date)
            {
                throw new ApplicationException("Unable to create due to StartTime is out of range.");
            }

            var showTimesByRoom = await _unitOfWork.ShowtimeRepository.GetShowTimeByRoomIdAsync(showtime.RoomId);


            foreach (var st in showTimesByRoom)
            {
                if ((existingShowTime.StartTime < st.EndTime && existingShowTime.EndTime > st.StartTime) ||
                    (existingShowTime.EndTime > st.StartTime && existingShowTime.StartTime < st.EndTime))
                {
                    throw new ApplicationException("Unable to create due to other StartTime and EndTime.");
                }
            }

            bool checkStartTime = await _unitOfWork.ShowtimeRepository.CheckStartTimeAsync(existingShowTime.StartTime);
            if (!checkStartTime)
            {
                throw new ApplicationException("Unable to create due to other StartTime.");
            }

            var updatedShowTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.UpdateAsync(existingShowTime));
            return updatedShowTime;
        }

        public async Task<Dictionary<DateTime, List<ShowTimeDto>>> GetShowTimeFromDateToDate(Guid movieId, DateTime fromDate, DateTime toDate)
        {
            var movie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
            if (movie == null)
            {
                throw new NotFoundException("Movie does not found!");
            }

            if (fromDate.Date > toDate.Date)
            {
                throw new ApplicationException("Invalid time range.");
            }

            if (movie.FromDate.Date > DateTime.Now.Date)
            {
                throw new ApplicationException("This movie schedule can not be leak.");
            }

            var showTimes = await _unitOfWork.ShowtimeRepository.GetShowTimeFromDateToDate(movieId, fromDate, toDate);
            if (showTimes == null)
            {
                throw new NotFoundException("ShowTime does not found.");
            }
            var dictionary = showTimes.GroupBy(st => st.StartTime.Date)
                .ToDictionary(g => g.Key, g => _mapper.Map<List<ShowTimeDto>>(g.ToList()));

            return dictionary;
        }




    }
}