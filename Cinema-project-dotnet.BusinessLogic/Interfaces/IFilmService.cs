using Cinema_project_dotnet.BusinessLogic.DTOs;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IFilmService
    {
        Task<List<FilmDTO>> GetAllFilmsAsync();
        Task<FilmDTO> GetFilmByIdAsync(int id);
        Task<FilmDTO> CreateFilmAsync(FilmDTO filmDto);
        Task<FilmDTO> UpdateFilmAsync(int id, FilmDTO filmDto);
        Task DeleteFilmAsync(int id);
    }
}
