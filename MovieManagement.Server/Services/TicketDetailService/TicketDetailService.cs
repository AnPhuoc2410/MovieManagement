
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.TicketDetailServices
{
    public class TicketDetailService : ITicketDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TicketDetailService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

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
                if (showtimes.Count == 0)
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
                if (showtimes.Count == 0)
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

                existingShowTime.StartTime = showtime.StartTime;
                existingShowTime.MovieId = showtime.MovieId;
                existingShowTime.RoomId = showtime.RoomId;

                var updatedShowTime = await _unitOfWork.ShowtimeRepository.UpdateAsync(existingShowTime);
                if (updatedShowTime == null)
                    throw new DbUpdateException("Fail to update showtime.");

                return _mapper.Map<ShowTimeDto>(updatedShowTime);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<TicketDetailDto> CreateTicketDetailAsync(TicketDetailDto ticketDetail)
        {
            try
            {
                var newTicketDetail = _mapper.Map<TicketDetail>(ticketDetail);
                var createdTicketDetail = await _unitOfWork.TicketDetailRepository.CreateAsync(newTicketDetail);
                if (createdTicketDetail == null)
                    throw new Exception("Failed to create ticket detail.");
                return _mapper.Map<TicketDetailDto>(createdTicketDetail);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while processing into the database.", ex);
            }
        }

        public async Task<TicketDetailDto> GetTicketDetailByIdAsync(Guid id)
        {
            try
            {
                var ticketDetails = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
                if (ticketDetails == null)
                    throw new NotFoundException("Ticket not found");
                return _mapper.Map<TicketDetailDto>(ticketDetails);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<TicketDetailDto>> GetTicketDetailPageAsync(int page, int pageSize)
        {
            try
            {
                var ticketDetails = await _unitOfWork.TicketDetailRepository.GetPageAsync(page, pageSize);
                if (ticketDetails.Count == 0)
                    throw new NotFoundException("Ticket details not found!");
                return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<IEnumerable<TicketDetailDto>> GetAllTicketDetailsAsync()
        {
            try
            {
                var ticketDetails = await _unitOfWork.TicketDetailRepository.GetAllAsync();
                if (ticketDetails.Count == 0)
                    throw new NotFoundException("No ticket details found!");
                return _mapper.Map<List<TicketDetailDto>>(ticketDetails);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<TicketDetailDto> UpdateTicketDetailAsync(Guid id, TicketDetailDto ticketDetail)
        {
            try
            {
                var existingTicketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
                if (existingTicketDetail == null)
                    throw new NotFoundException("Ticket detail not found");
                var updatedTicketDetail = await _unitOfWork.TicketDetailRepository.UpdateAsync(_mapper.Map<TicketDetail>(ticketDetail));
                if (updatedTicketDetail == null)
                    throw new DbUpdateException("Fail to update ticket detail.");

                return _mapper.Map<TicketDetailDto>(updatedTicketDetail);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

        public async Task<bool> DeleteTicketDetailAsync(Guid id)
        {
            try
            {
                var ticketDetail = await _unitOfWork.TicketDetailRepository.GetByIdAsync(id);
                if (ticketDetail == null)
                    throw new NotFoundException("Ticket detail not found!");
                return await _unitOfWork.TicketDetailRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Couldn't access the database due to a system error.", ex);
            }
        }

    }
}
