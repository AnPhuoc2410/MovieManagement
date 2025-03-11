﻿using AutoMapper;
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

            CreateMap<User, UserDto>();
            CreateMap<User, UserDto.UserResponse>();
            CreateMap<UserDto.CreateUser, User>()
                .ForMember(dest => dest.Bills, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(_ => Guid.NewGuid()));

            //List User Response For Admin  
            CreateMap<User, UserResponse>();
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

            CreateMap<Promotion, PromotionDto>();
            CreateMap<PromotionDto, Promotion>();

            CreateMap<Seat, SeatDto>();
            CreateMap<SeatDto, Seat>();

            CreateMap<Room, RoomDto>();
            CreateMap<RoomDto, Room>();

            CreateMap<Bill, BillDto>();
            CreateMap<BillDto, Bill>();

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

            CreateMap<Room, RoomResponseModel>();
            CreateMap<RoomResponseModel, Room>();

            CreateMap<Seat, SeatResponseModel>();
            CreateMap<SeatResponseModel, Seat>();

            CreateMap<SeatType, SeatTypeResponseModel>();
            CreateMap<SeatTypeResponseModel, SeatType>();


            CreateMap<AuthDto.LoginRequest, AuthDto.LoginResponse>();
            CreateMap<AuthDto.LoginResponse, AuthDto.LoginRequest>();

            CreateMap<AuthDto.RegisterRequest, User>();
            CreateMap<User, AuthDto.RegisterRequest>();

        }
    }
}
