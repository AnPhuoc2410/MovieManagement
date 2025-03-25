using AutoMapper;
using MovieManagement.Server.Data;
using MovieManagement.Server.Exceptions;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MovieTheaterService
{
    public class MovieTheaterService : IMovieTheaterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MovieTheaterService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MovieTheaterDto>> GetAllMovieTheatersAsync()
        {
            var movieTheaters = await _unitOfWork.MovieTheaterRepository.GetAllAsync() 
                ?? throw new NotFoundException("Movie theaters not found!");
            return _mapper.Map<IEnumerable<MovieTheaterDto>>(movieTheaters);
        }

        public async Task<MovieTheaterDto> GetMovieTheaterByIdAsync(Guid movieTheaterId)
        {
            var movieTheater = await _unitOfWork.MovieTheaterRepository.GetByIdAsync(movieTheaterId) 
                ?? throw new NotFoundException("Movie theater not found!");
            return _mapper.Map<MovieTheaterDto>(movieTheater);
        }

        public async Task<IEnumerable<MovieTheaterDto>> GetMovieTheaterPageAsync(int page, int pageSize)
        {
            var movieTheaters = await _unitOfWork.MovieTheaterRepository.GetPageAsync(page, pageSize) 
                ?? throw new NotFoundException("Movie theater not found!");
            return _mapper.Map<List<MovieTheaterDto>>(movieTheaters);
        }

        public async Task<MovieTheaterDto> CreateMovieTheaterAsync(MovieTheaterDto movieTheater)
        {
            movieTheater.MovieTheaterId = Guid.NewGuid();
            movieTheater.CreatedDate = DateTime.Now;
            movieTheater.UpdatedDate = DateTime.Now;
            var newMovieTheater = _mapper.Map<MovieTheater>(movieTheater);
            return _mapper.Map<MovieTheaterDto>(await _unitOfWork.MovieTheaterRepository.CreateAsync(newMovieTheater));
        }

        public async Task<MovieTheaterDto> UpdateMovieTheaterAsync(Guid movieTheaterId, MovieTheaterDto movieTheater)
        {
            var movieTheaterToUpdate = await _unitOfWork.MovieTheaterRepository.GetByIdAsync(movieTheaterId) 
                ?? throw new NotFoundException("Movie theater not found!");
            movieTheater.MovieTheaterId = movieTheaterId;
            movieTheater.CreatedDate = movieTheaterToUpdate.CreatedDate;
            movieTheater.UpdatedDate = DateTime.Now;
            var updatedMovieTheater = _mapper.Map<MovieTheater>(movieTheater);
            return _mapper.Map<MovieTheaterDto>(await _unitOfWork.MovieTheaterRepository.UpdateAsync(updatedMovieTheater));
        }

        public async Task<bool> DeleteMovieTheaterAsync(Guid movieTheaterId)
        {
            var movieTheater = await _unitOfWork.MovieTheaterRepository.GetByIdAsync(movieTheaterId) 
                ?? throw new NotFoundException("Movie theater not found!");
            return await _unitOfWork.MovieTheaterRepository.DeleteAsync(movieTheater);
        }

    }
}
