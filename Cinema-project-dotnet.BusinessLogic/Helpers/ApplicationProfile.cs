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
                .ForMember(dest => dest.FilmGenres, opt => opt.MapFrom(src => src.FilmGenres))
                .ForMember(dest => dest.FilmDirectors, opt => opt.MapFrom(src => src.FilmDirectors));

            CreateMap<FilmGenre, FilmGenreDTO>();
            CreateMap<FilmDirector, FilmDirectorDTO>();

            CreateMap<FilmDTO, Film>()
                .ForMember(dest => dest.FilmGenres, opt => opt.MapFrom(src => src.FilmGenres))
                .ForMember(dest => dest.FilmDirectors, opt => opt.MapFrom(src => src.FilmDirectors));

            CreateMap<FilmGenreDTO, FilmGenre>();
            CreateMap<FilmDirectorDTO, FilmDirector>();
        }
    }
}
