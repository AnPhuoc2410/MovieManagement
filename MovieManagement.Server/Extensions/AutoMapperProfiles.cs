using AutoMapper;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
namespace MovieManagement.Server.Extensions
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<NhanVien, NhanVienDto>();
            CreateMap<NhanVienDto, NhanVien>();

        }
    }
}
