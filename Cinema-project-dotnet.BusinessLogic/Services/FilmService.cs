using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class FilmService : IFilmService
    {
        private readonly IGenericRepository<Film> _filmRepo;
        private readonly IGenericRepository<Genre> _genreRepo;
        private readonly IGenericRepository<Director> _directorRepo;
        private readonly IMapper _mapper;
        public FilmService(
            IGenericRepository<Film> filmRepo, 
            IGenericRepository<Genre> genreRepo, 
            IGenericRepository<Director> directorRepo, 
            IMapper mapper)
        {
            this._filmRepo = filmRepo;
            this._genreRepo = genreRepo;
            this._directorRepo = directorRepo;
            this._mapper = mapper;
        }
        
        public async Task<List<FilmDTO>> GetAllFilmsAsync()
        {
            var film = await _filmRepo.GetAllAsync();

            return _mapper.Map<List<FilmDTO>>(film);
        }
        
        public async Task<FilmDTO> GetFilmByIdAsync(int id)
        {
            var film = await _filmRepo.GetByIdAsync(id);
            if (film == null)
            {
                throw new KeyNotFoundException("Film not found");
            }
            return _mapper.Map<FilmDTO>(film);
        }
        public async Task<FilmDTO> CreateFilmAsync(FilmDTO filmDTO)
        {
            var film = _mapper.Map<Film>(filmDTO);
            await _filmRepo.AddAsync(film);
            return _mapper.Map<FilmDTO>(film);
        }
        public async Task DeleteFilmAsync(int id)
        {
            var film = await _filmRepo.GetByIdAsync(id);
            if (film == null)
            {
                throw new KeyNotFoundException("Film not found");
            }

            await _filmRepo.DeleteAsync(film);
        }
        public async Task<Film> UpdateFilmAsync(int id, FilmDTO filmDTO)
        {
            var film = await _filmRepo.GetByIdAsync(id);
            if (film == null)
            {
                throw new KeyNotFoundException("Film not found");
            }

            _mapper.Map(filmDTO, film);

            await _filmRepo.UpdateAsync(film);
            return film;
        }

    }
}
