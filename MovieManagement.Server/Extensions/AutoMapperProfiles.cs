﻿using AutoMapper;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
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

            //User DTO <=> User Respone
            CreateMap<User, UserDto.UserResponse>();
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

            CreateMap<SeatType, SeatTypeDto>();
            CreateMap<SeatTypeDto, SeatType>();

            CreateMap<TicketDetail, TicketDetailDto>();
            CreateMap<TicketDetailDto, TicketDetail>();

            CreateMap<ShowTime, ShowTimeDto>();
            CreateMap<ShowTimeDto, ShowTime>();

            CreateMap<Movie, MovieDto>();
            CreateMap<MovieDto, Movie>();

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




            CreateMap<UserDto.UserRequest, User>();
        }
    }
}
