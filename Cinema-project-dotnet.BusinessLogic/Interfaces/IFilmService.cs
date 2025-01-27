using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IFilmService
    {
        Task<List<FilmDTO>> GetAllFilmsAsync();
        Task<FilmDTO> GetFilmByIdAsync(int id);
        Task<FilmDTO> CreateFilmAsync(FilmDTO filmDTO);
        Task<Film> UpdateFilmAsync(int id, FilmDTO filmDTO);
        Task DeleteFilmAsync(int id);
    }
}
