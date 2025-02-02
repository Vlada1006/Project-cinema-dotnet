using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using System.Net;


namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class GenreService : IGenreService
    {
        private readonly IGenericRepository<Genre> _genreRepo;
        private readonly IMapper _mapper;

        public GenreService(IGenericRepository<Genre> genreRepo, IMapper mapper)
        {
            _genreRepo = genreRepo;
            _mapper = mapper;
        }

        public async Task<List<GenreDTO>> GetAllGenrsAsync()
        {
            var genres = await _genreRepo.GetAllAsync();
            return _mapper.Map<List<GenreDTO>>(genres);
        }

        public async Task<GenreDTO> GetGenreByIdAsync(int id)
        {
            var genre = await _genreRepo.GetByIdAsync(id);

            if (genre == null)
            {
                throw new HttpException("Genre not found", HttpStatusCode.NotFound);
            }

            return _mapper.Map<GenreDTO>(genre);
        }

        public async Task CreateGenreAsync(GenreDTO genreDTO)
        {
            var genre = _mapper.Map<Genre>(genreDTO);
            await _genreRepo.AddAsync(genre);
        }

        public async Task UpdateGenreAsync(int id, GenreDTO genreDTO)
        {
            var genre = await _genreRepo.GetByIdAsync(id);

            if (genre == null)
            {
                throw new HttpException("Genre not found", HttpStatusCode.NotFound);
            }

            _mapper.Map(genreDTO, genre);

            await _genreRepo.UpdateAsync(genre);
        }

        public async Task DeleteGenreAsync(int id)
        {
            var genre = await _genreRepo.GetByIdAsync(id);

            if (genre == null)
            {
                throw new HttpException("Genre not found", HttpStatusCode.NotFound);
            }

            await _genreRepo.DeleteAsync(genre);
        }
    }
}
