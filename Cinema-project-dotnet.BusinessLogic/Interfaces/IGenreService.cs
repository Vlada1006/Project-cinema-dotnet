using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IGenreService
    {
        Task<List<GenreDTO>> GetAllGenrsAsync();
        Task<GenreDTO> GetGenreByIdAsync(int id);
        Task CreateGenreAsync(GenreDTO genreDTO);
        Task UpdateGenreAsync(int id, GenreDTO genreDTO);
        Task DeleteGenreAsync(int id);
    }
}
