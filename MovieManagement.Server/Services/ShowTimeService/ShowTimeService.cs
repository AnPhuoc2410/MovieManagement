using AutoMapper;
using Microsoft.EntityFrameworkCore;
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

        public async Task<ShowTimeDto> CreateShowtimeAsync(ShowTimeDto showtime)
        {
            try
            {
                var newShowtime = _mapper.Map<ShowTime>(showtime);
                newShowtime.ShowTimeId = Guid.NewGuid();
                var createdShowtime = await _unitOfWork.ShowtimeRepository.CreateAsync(newShowtime);
                if (createdShowtime == null)
                    throw new Exception("Failed to create showtime.");
                return _mapper.Map<ShowTimeDto>(createdShowtime);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into the database.", ex);
            }

            bool checkStartTime = await _unitOfWork.ShowtimeRepository.CheckStartTimeAsync(newShowTime.StartTime);
            if (!checkStartTime)
            {
                throw new ApplicationException("Unable to create due to other StartTime.");
            }

        public async Task<bool> DeleteShowtimeAsync(Guid movieId, Guid roomId)
        {
            try
            {
                var showtime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
                if (showtime == null)
                    throw new NotFoundException("Showtime not found!");

                return await _unitOfWork.ShowtimeRepository.DeleteComposeAsync(movieId, roomId);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<ShowTimeDto>> GetAllShowtimeAsync()
        {
            try
            {
                var showtimes = await _unitOfWork.ShowtimeRepository.GetAllAsync();
                if (showtimes == null)
                    throw new NotFoundException("ShowTime does not found!");
                return _mapper.Map<List<ShowTimeDto>>(showtimes);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<ShowTimeDto>> GetShowtimePageAsync(int page, int pageSize)
        {
            try
            {
                var showtimes = await _unitOfWork.ShowtimeRepository.GetPageAsync(page, pageSize);
                if (showtimes == null)
                    throw new NotFoundException("ShowTime does not found!");
                return _mapper.Map<List<ShowTimeDto>>(showtimes);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<ShowTimeDto> GetShowtimeByComposeIdAsync(Guid movieId, Guid roomId)
        {
            try
            {
                var showtime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
                if (showtime == null)
                    throw new NotFoundException("ShowTime not found!");
                return _mapper.Map<ShowTimeDto>(showtime);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<ShowTimeDto> UpdateShowtimeAsync(Guid movieId, Guid roomId, ShowTimeDto showtime)
        {
            try
            {
                var existingShowTime = await _unitOfWork.ShowtimeRepository.GetByComposeIdAsync(movieId, roomId);
                if (existingShowTime == null)
                    throw new NotFoundException("ShowTime not found!");
                showtime.MovieId = movieId;
                showtime.RoomId = roomId;
                var updatedShowTime = await _unitOfWork.ShowtimeRepository.UpdateAsync(_mapper.Map<ShowTime>(showtime));
                if (updatedShowTime == null)
                    throw new DbUpdateException("Fail to update showtime.");

                return _mapper.Map<ShowTimeDto>(updatedShowTime);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }
    }
}
