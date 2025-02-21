using AutoMapper;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
namespace MovieManagement.Server.Extensions
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {

            CreateMap<Employee, EmployeeDto>();
            CreateMap<EmployeeDto, Employee>();

            CreateMap<Promotion, PromotionDto>();
            CreateMap<PromotionDto, Promotion>();

            CreateMap<TicketDetail, TicketDetailDto>();
            CreateMap<TicketDetailDto, TicketDetail>();

            CreateMap<TicketType, TicketTypeDto>();
            CreateMap<TicketTypeDto, TicketType>();

            CreateMap<Showtime, ShowtimeDto>();
            CreateMap<ShowtimeDto, Showtime>();
        }
    }
}
