using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using System.Net;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class DirectorService : IDirectorService
    {
        private readonly IGenericRepository<Director> _directorRepo;
        private readonly IMapper _mapper;

        public DirectorService(IGenericRepository<Director> directorRepo, IMapper mapper)
        {
            _directorRepo = directorRepo;
            _mapper = mapper;
        }

        public async Task<List<DirectorDTO>> GetAllDirectorsAsync()
        {
            var directors = await _directorRepo.GetAllAsync();
            return _mapper.Map<List<DirectorDTO>>(directors);
        }

        public async Task<DirectorDTO> GetDirectorByIdAsync(int id)
        {
            var director = await _directorRepo.GetByIdAsync(id);

            if (director == null)
            {
                throw new HttpException("Director not found", HttpStatusCode.NotFound);
            }

            return _mapper.Map<DirectorDTO>(director);
        }

        public async Task CreateDirectorAsync(DirectorDTO directorDTO)
        {
            var director = _mapper.Map<Director>(directorDTO);
            await _directorRepo.AddAsync(director);
        }

        public async Task UpdateDirectorAsync(int id, DirectorDTO directorDTO)
        {
            var director = await _directorRepo.GetByIdAsync(id);

            if (director == null)
            {
                throw new HttpException("Director not found", HttpStatusCode.NotFound);
            }

            _mapper.Map(directorDTO, director);

            await _directorRepo.UpdateAsync(director);
        }

        public async Task DeleteDirectorAsync(int id)
        {
            var director = await _directorRepo.GetByIdAsync(id);

            if (director == null)
            {
                throw new HttpException("Director not found", HttpStatusCode.NotFound);
            }

            await _directorRepo.DeleteAsync(director);
        }
    }
}
