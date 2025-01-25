using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class FilmService : IFilmService
    {
        private readonly IGenericRepository<Film> filmRepo;
        private readonly IMapper mapper;
        public FilmService(IGenericRepository<Film> filmRepo, IMapper mapper)
        {
            this.filmRepo = filmRepo;
            this.mapper = mapper;
        }

        public async Task<FilmDTO> CreateFilmAsync(FilmDTO filmDto)
        {
            var film = mapper.Map<Film>(filmDto);
            await filmRepo.AddAsync(film);
            return mapper.Map<FilmDTO>(film);
        }
            
        public async Task DeleteFilmAsync(int id)
        {
            var film = await filmRepo.GetByIdAsync(id);
            if (film == null) 
            {
                throw new KeyNotFoundException("Film not found");
            }

            await filmRepo.DeleteAsync(id);
        }

        public Task<List<FilmDTO>> GetAllFilmsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<FilmDTO> GetFilmByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<FilmDTO> UpdateFilmAsync(int id, FilmDTO filmDto)
        {
            throw new NotImplementedException();
        }
    }
}
