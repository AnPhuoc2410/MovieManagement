using AutoMapper;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Models.RequestModel;
using MovieManagement.Server.Models.ResponseModel;
namespace MovieManagement.Server.Extensions
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {

            //User DTO <=> User Create
            CreateMap<User, UserDto.CreateUser>();
            CreateMap<UserDto.CreateUser, User>()
                .ForMember(dest => dest.Bills, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(_ => Guid.NewGuid()));
            
            CreateMap<UserDto.UpdateRequest, User>()
                .ForMember(dest => dest.Bills, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UserResponse, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ForMember(dest => dest.JoinDate, opt => opt.Ignore())
                .ForMember(dest => dest.IDCard, opt => opt.Ignore())
                .ForMember(dest => dest.BirthDate, opt => opt.Ignore())
                .ForMember(dest => dest.Address, opt => opt.Ignore());

            //Create User By OAuth
            CreateMap<User, OAuthRequest>();
            CreateMap<OAuthRequest, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(_ => Guid.NewGuid()));
            //User DTO <=> User Respone
            CreateMap<User, UserDto.UserResponse>()
                .ForMember(dest => dest.JoinDate, opt => opt.MapFrom(src => src.JoinDate.ToString("yyyy-MM-ddTHH:mm:ssZ")))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.ToString("yyyy-MM-ddTHH:mm:ssZ")));

            CreateMap<UserDto.UserResponse, User>();

            //User DTO <=> Register Request
            CreateMap<AuthDto.RegisterRequest, User>();
            CreateMap<User, AuthDto.RegisterRequest>();

            CreateMap<User, UserDto>();

            CreateMap<Promotion, PromotionDto>();
            CreateMap<PromotionDto, Promotion>();

            CreateMap<Seat, SeatDto>();
            CreateMap<SeatDto, Seat>();

            CreateMap<Room, RoomDto>();
            CreateMap<RoomDto, Room>();

            CreateMap<Bill, BillDto>();
            CreateMap<BillDto, Bill>();

            CreateMap<BillRequest, Bill>();

            CreateMap<Bill, BillRequest>();

            //Bill Report for user
            CreateMap<Bill, BillReportRequest>();

            CreateMap<SeatType, SeatTypeDto>();
            CreateMap<SeatTypeDto, SeatType>();

            CreateMap<TicketDetail, TicketDetailDto>();
            CreateMap<TicketDetailDto, TicketDetail>();

            CreateMap<ShowTime, ShowTimeDto>();
            CreateMap<ShowTimeDto, ShowTime>();

            CreateMap<Movie, MovieDto>();
            CreateMap<MovieDto, Movie>();

            CreateMap<MovieTheater, MovieTheaterDto>();
            CreateMap<MovieTheaterDto, MovieTheater>();

            CreateMap<Movie, MoviePreview>();
            CreateMap<MoviePreview, Movie>();

            CreateMap<MovieRequest, Movie>();

            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryDto, Category>();

            CreateMap<Room, RoomResponseModel>();
            CreateMap<RoomResponseModel, Room>();

            CreateMap<Seat, SeatResponseModel>();
            CreateMap<SeatResponseModel, Seat>();

            CreateMap<SeatType, SeatTypeResponseModel>();
            CreateMap<SeatTypeResponseModel, SeatType>();


            CreateMap<AuthDto.LoginRequest, AuthDto.LoginResponse>();
            CreateMap<AuthDto.LoginResponse, AuthDto.LoginRequest>();

            CreateMap<TicketDetail, TicketDetailResponseModel>();
            //CreateMap<TicketDetailResponseModel, TicketDetail>();

            CreateMap<ShowTime, ShowTimeInfo>();

            CreateMap<UserDto.UserRequest, User>();
        }
    }
}
