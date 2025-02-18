using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IFilmService
    {
        Task<List<FilmGetDTO>> GetAllFilmsAsync();
        Task<FilmGetDTO> GetFilmByIdAsync(int id);
        Task CreateFilmAsync(FilmCreateUpdateDTO filmDTO);
        Task UpdateFilmAsync(int id, FilmCreateUpdateDTO filmDTO);
        Task DeleteFilmAsync(int id);
        Task<List<FilmStatisticsDTO>> GetFilmStatisticsAsync(DateTime? startDate, DateTime? endDate);
    }
}
