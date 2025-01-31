using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;

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
        
        public async Task<List<FilmGetDTO>> GetAllFilmsAsync()
        {
            var films = await _filmRepo.GetAllAsync(query => query
                .Include(f => f.FilmGenres)
                .ThenInclude(fg => fg.Genre)
                .Include(f => f.FilmDirectors)
                .ThenInclude(fg => fg.Director));

            return _mapper.Map<List<FilmGetDTO>>(films);
        }
        
        public async Task<FilmGetDTO> GetFilmByIdAsync(int id)
        {
            var film = await _filmRepo.GetByIdAsync(id, query => query
                .Include(f => f.FilmGenres)
                .ThenInclude(fg => fg.Genre)
                .Include(f => f.FilmDirectors)
                .ThenInclude(fg => fg.Director));

            if (film == null)
            {
                throw new HttpException("Film not found", HttpStatusCode.NotFound);
            }

            return _mapper.Map<FilmGetDTO>(film);
        }

        public async Task CreateFilmAsync(FilmCreateUpdateDTO filmDTO)
        {
            var film = _mapper.Map<Film>(filmDTO);

            foreach (var genreId in filmDTO.GenreIds)
            {
                var genre = await _genreRepo.GetByIdAsync(genreId);
                if (genre == null)
                {
                    throw new HttpException($"Genre with ID {genreId} does not exist.", HttpStatusCode.NotFound);
                }

                var filmGenre = new FilmGenre
                {
                    Film = film,
                    Genre = genre
                };

                film.FilmGenres.Add(filmGenre);
            }

            foreach (var directorId in filmDTO.DirectorIds)
            {
                var director = await _directorRepo.GetByIdAsync(directorId);
                if (director == null)
                {
                    throw new HttpException($"Director with ID {directorId} does not exist.", HttpStatusCode.NotFound);
                }

                var filmDirector = new FilmDirector
                {
                    Film = film,
                    Director = director
                };

                film.FilmDirectors.Add(filmDirector);
            }

            await _filmRepo.AddAsync(film);
        }

        public async Task DeleteFilmAsync(int id)
        {
            var film = await _filmRepo.GetByIdAsync(id);
            if (film == null)
            {
                throw new HttpException("Film not found", HttpStatusCode.NotFound);
            }

            await _filmRepo.DeleteAsync(film);
        }

        public async Task UpdateFilmAsync(int id, FilmCreateUpdateDTO filmDTO)
        {
            var film = await _filmRepo.GetByIdAsync(id, query => query
                .Include(f => f.FilmGenres)
                .ThenInclude(fg => fg.Genre)
                .Include(f => f.FilmDirectors)
                .ThenInclude(fg => fg.Director));

            if (film == null)
            {
                throw new HttpException("Film not found", HttpStatusCode.NotFound);
            }

            _mapper.Map(filmDTO, film);

            // Clear existing genres associated with the film to replace them with new ones
            var existingGenres = film.FilmGenres.ToList();
            foreach (var existingGenre in existingGenres)
            {
                film.FilmGenres.Remove(existingGenre);
            }

            // Loop through each genre from the FilmDTO and add them to the film
            foreach (var genreId in filmDTO.GenreIds)
            {
                var genre = await _genreRepo.GetByIdAsync(genreId);
                if (genre == null)
                {
                    throw new HttpException($"Genre with ID {genreId} does not exist.", HttpStatusCode.NotFound);
                }

                var filmGenre = new FilmGenre
                {
                    Film = film,
                    Genre = genre
                };

                film.FilmGenres.Add(filmGenre);
            }

            // Clear existing directors associated with the film to replace them with new ones
            var existingDirectors = film.FilmDirectors.ToList();
            foreach (var existingDirector in existingDirectors)
            {
                film.FilmDirectors.Remove(existingDirector);
            }

            // Loop through each director from the FilmDTO and add them to the film
            foreach (var directorId in filmDTO.DirectorIds)
            {
                var director = await _directorRepo.GetByIdAsync(directorId);
                if (director == null)
                {
                    throw new HttpException($"Director with ID {directorId} does not exist.", HttpStatusCode.NotFound);
                }

                var filmDirector = new FilmDirector
                {
                    Film = film,
                    Director = director
                };

                film.FilmDirectors.Add(filmDirector);
            }

            await _filmRepo.UpdateAsync(film);
        }
    }
}
