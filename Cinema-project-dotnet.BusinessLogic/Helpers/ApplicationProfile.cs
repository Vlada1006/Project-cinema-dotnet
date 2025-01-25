using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;

namespace Cinema_project_dotnet.BusinessLogic.Helpers
{
    public class ApplicationProfile : AutoMapper.Profile
    {
        public ApplicationProfile()
        {
            CreateMap<Film, FilmDTO>()
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres.Select(g => g.Name).ToList()))
                .ForMember(dest => dest.Directors, opt => opt.MapFrom(src => src.Directors.Select(d => d.Name).ToList()));
        }
    }
}
