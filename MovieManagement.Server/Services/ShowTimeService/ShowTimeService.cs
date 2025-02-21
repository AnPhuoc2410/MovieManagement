using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.ShowTimeService
{
    public class ShowTimeService : IShowTimeService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ShowTimeService(IUnitOfWork unitOfWork)
        => _unitOfWork = unitOfWork;
        public async Task<Showtime> CreateShowTime(Showtime showtime)
        {
            var newShowTime = new Showtime() 
            {
            Movie = showtime.Movie,
            MovieId = showtime.MovieId,
            StartTime = showtime.StartTime,
            };

            return await _unitOfWork.ShowtimeRepository.CreateAsync(newShowTime);
        }

        public Task<bool> DeleteShowtime(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Showtime>> GetAllShowtime()
        {
            return await _unitOfWork.ShowtimeRepository.GetAllAsync();
        }

        public async Task<Showtime> GetShowtime(Guid id)
        {
            var ticket = await _unitOfWork.ShowtimeRepository.GetByIdAsync(id);
            if(ticket == null)
            {
                throw new Exception("Show time not found");
            }
            return ticket;  
        }

        public async Task<Showtime> UpdateShowTime(Guid id, Showtime showtime)
        {
            var existinShowTime = await _unitOfWork.ShowtimeRepository.GetByIdAsync(id);
            if (existinShowTime == null)
            {
                throw new Exception("Show time not found");
            }
            existinShowTime.StartTime = showtime.StartTime;
            existinShowTime.MovieId = showtime.MovieId;
            existinShowTime.Movie = showtime.Movie;
            var updatedShowTime = await _unitOfWork.ShowtimeRepository.UpdateAsync(existinShowTime);
            return updatedShowTime;
        }
    }
}
