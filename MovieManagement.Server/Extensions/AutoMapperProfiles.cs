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

        }
    }
}
