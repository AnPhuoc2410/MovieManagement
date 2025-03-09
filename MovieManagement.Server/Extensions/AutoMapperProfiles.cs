using AutoMapper;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
namespace MovieManagement.Server.Extensions
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {

            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            CreateMap<Promotion, PromotionDto>();
            CreateMap<PromotionDto, Promotion>();

            CreateMap<Seat, SeatDto>();
            CreateMap<SeatDto, Seat>();

            CreateMap<Room, RoomDto>();
            CreateMap<RoomDto, Room>();

            CreateMap<Bill, BillDto>();
            CreateMap<BillDto, BillDto>();

            CreateMap<SeatType, SeatTypeDto>();
            CreateMap<SeatTypeDto, SeatType>();

            CreateMap<TicketDetail, TicketDetailDto>();
            CreateMap<TicketDetailDto, TicketDetail>();

            CreateMap<ShowTime, ShowTimeDto>();
            CreateMap<ShowTimeDto, ShowTime>();

            CreateMap<Movie, MovieDto>();
            CreateMap<MovieDto, Movie>();

            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryDto, Category>();


            CreateMap<LoginRequestDto,LoginResponseDto>();
            CreateMap<LoginResponseDto, LoginRequestDto>();

            CreateMap<RegisterDto, User>();
            CreateMap<User, RegisterDto>();

        }
    }
}
