using AutoMapper;
using MovieManagement.Server.Models;
using MovieManagement.Server.DTOs;

namespace MovieManagement.Server.Mapping
{
    public class NhanVienProfile : Profile
    {
        public NhanVienProfile()
        {
            CreateMap<NhanVien, NhanVienDto>();
            CreateMap<NhanVienDto, NhanVien>();
        }
    }
}
