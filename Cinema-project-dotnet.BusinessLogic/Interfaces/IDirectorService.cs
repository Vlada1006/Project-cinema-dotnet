using Cinema_project_dotnet.BusinessLogic.DTOs;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IDirectorService
    {
        Task<List<DirectorDTO>> GetAllDirectorsAsync();
        Task<DirectorDTO> GetDirectorByIdAsync(int id);
        Task CreateDirectorAsync(DirectorDTO directorDTO);
        Task UpdateDirectorAsync(int id, DirectorDTO directorDTO);
        Task DeleteDirectorAsync(int id);
    }
}
