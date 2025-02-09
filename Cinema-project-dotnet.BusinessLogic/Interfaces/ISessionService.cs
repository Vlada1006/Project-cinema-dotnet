using Cinema_project_dotnet.BusinessLogic.DTOs;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface ISessionService
    {
        Task<List<SessionDTO>> GetAllSessionsAsync();
        Task<SessionDTO> GetSessionByIdAsync(int id);
        Task CreateSessionAsync(SessionDTO sessionDTO);
        Task UpdateSessionAsync(int id, SessionDTO sessionDTO);
        Task DeleteSessionAsync(int id);
    }
}
