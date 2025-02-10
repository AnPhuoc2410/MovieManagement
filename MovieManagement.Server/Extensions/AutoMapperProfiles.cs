using AutoMapper;
using Post_Management.API.Data.Models.Domains;
using Post_Management.API.Data.Models.DTOs;
using Post_Management.API.Data.Models.Responses;
using Post_Management.API.Repositories;

namespace Post_Management.API.Extensions
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<CategoryDTO, Category>()
               .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<BlogPostDTO, BlogPost>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Categories, opt => opt.Ignore());

            CreateMap<BlogPost, BlogPostResponse>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories))
                .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate.ToString("yyyy-MM-dd")));
            CreateMap<Category, CategoryResponse>();

            CreateMap<BlogImage, BlogImageResponse>()
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => src.DateCreated.ToString("yyyy-MM-dd")));
            CreateMap<BlogImageDTO, BlogImage>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.FileExtension, opt => opt.MapFrom(src => Path.GetExtension(src.File.FileName)))
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.Now));
        }
    }
}
