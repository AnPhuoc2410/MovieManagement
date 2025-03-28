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
            if(showTimesByRoom == null)
            {
                throw new NotFoundException("ShowTime does not found!");
            }

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

            var createdShowTime = _unitOfWork.ShowtimeRepository.PrepareCreateEntity(newShowTime);

            var IsGenerated = CreateTicketByShowTime(createdShowTime.ShowTimeId, room.RoomId);
            if (IsGenerated.Result <= 1)
            {
                throw new ApplicationException("Unable to create due to systems error.");
            }

            return _mapper.Map<ShowTimeDto>(createdShowTime);
        }

        private async Task<int> CreateTicketByShowTime(Guid showTimeId, Guid roomId)
        {
            var seats = await _unitOfWork.SeatRepository.GetByRoomIdAsync(roomId);

            if (seats.Count == 0)
                throw new NotFoundException("Seats does not found!");
            

            foreach (var s in seats)
                if (s.IsActive)
                    _unitOfWork.TicketDetailRepository.PrepareCreate(new TicketDetail
                    {
                        ShowTimeId = showTimeId,
                        SeatId = s.SeatId,
                        Version = new byte[8],
                        TicketId = Guid.NewGuid()
                    });
            

            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteShowtimeAsync(Guid showTimeId)
        {
            if(showTimeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var showTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId);
            if (showTime == null)
            {
                throw new NotFoundException("ShowTime does not found!");
            }
            return await _unitOfWork.ShowtimeRepository.DeleteAsync(showTimeId);
        }

        public async Task<IEnumerable<ShowTimeInfo>> GetAllShowtime()
        {
            var showtimes = _mapper.Map<List<ShowTimeInfo>>(await _unitOfWork.ShowtimeRepository.GetAllInfoAsync());
            if (showtimes.Count == 0)
            {
                throw new NotFoundException("ShowTime does not found!");
            }
            return showtimes;
        }

        public async Task<IEnumerable<ShowTimeDto>> GetShowtimePageAsync(int page, int pageSize)
        {
            if(page < 0 || pageSize < 1)
                throw new BadRequestException("Page and PageSize is invalid");
            var showtimes = await _unitOfWork.ShowtimeRepository.GetPageAsync(page, pageSize);
            if(showtimes == null)
                throw new NotFoundException("ShowTime not found!");
            return _mapper.Map<IEnumerable<ShowTimeDto>>(showtimes);
        }

        public async Task<ShowTimeDto> GetShowtimeByIdAsync(Guid showTimeId)
        {
            if(showTimeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
            var showTime = _mapper.Map<ShowTimeDto>(await _unitOfWork.ShowtimeRepository.GetByIdAsync(showTimeId));
            if (showTime == null)
            {
                throw new NotFoundException("ShowTime does not found!");
            }
            return showTime;
        }

        public async Task<ShowTimeDto> UpdateShowtimeAsync(Guid showTimeId, ShowTimeDto showtime)
        {
            if (showTimeId == Guid.Empty)
                throw new BadRequestException("Id cannot be empty!");
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


            existingShowTime.StartTime = new DateTime(showtime.StartTime.Year, showtime.StartTime.Month, showtime.StartTime.Day, showtime.StartTime.Hour, showtime.StartTime.Minute, 0);
            existingShowTime.EndTime = existingShowTime.StartTime.Add(TimeSpan.FromMinutes(movie.Duration));
            existingShowTime.MovieId = showtime.MovieId;
            existingShowTime.RoomId = showtime.RoomId;

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
        public async Task<Dictionary<string, Dictionary<string, List<object>>>> GetShowTimeFromDateToDate(Guid movieId, DateTime fromDate, DateTime toDate, string location)
        {
            if(movieId == Guid.Empty)
                throw new BadRequestException("MovieId cannot be empty!");
            var movie = await _unitOfWork.MovieRepository.GetByIdAsync(movieId);
            if (movie == null)
            {
                throw new NotFoundException("Movie not found!");
            }

            if (fromDate.Date > toDate.Date)
            {
                throw new ApplicationException("Invalid time range.");
            }

            if (movie.FromDate.Date > DateTime.Now.Date)
            {
                throw new ApplicationException("This movie schedule is not available yet.");
            }

            var showTimes = await _unitOfWork.ShowtimeRepository.GetShowTimeFromDateToDate(movieId, fromDate, toDate, location);

            if (showTimes == null || !showTimes.Any())
            {
                throw new NotFoundException("ShowTime not found.");
            }

            var groupedShowTimes = showTimes
                .Where(st => st.Room?.MovieTheater != null)
                .GroupBy(st => st.StartTime.Date)
                .ToDictionary(
                    dateGroup => dateGroup.Key.ToString("yyyy-MM-dd"),
                    dateGroup => dateGroup
                        .GroupBy(st => st.Room.MovieTheater.Location ?? "Unknown Location")
                        .ToDictionary(
                            locGroup => locGroup.Key,
                            locGroup => locGroup
                                .GroupBy(st => st.Room.MovieTheater)
                                .Select(theaterGroup => (object)new
                                {
                                    NameTheater = theaterGroup.Key.Name,
                                    AddressTheater = theaterGroup.Key.Address,
                                    ListShowTime = theaterGroup.Select(st => new
                                    {
                                        showTimeId = st.ShowTimeId,
                                        movieId = st.MovieId,
                                        roomId = st.RoomId,
                                        startTime = st.StartTime,
                                        endTime = st.EndTime
                                    }).ToList()
                                }).ToList()
                        )
                );

            return groupedShowTimes;
        }



    }
}