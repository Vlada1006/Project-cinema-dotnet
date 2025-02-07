using Cinema_project_dotnet.BusinessLogic.DTOs;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IRoomService
    {
        Task<List<RoomDTO>> GetAllRoomsAsync();
        Task<RoomDTO> GetRoomByIdAsync(int id);
        Task CreateRoomAsync(RoomDTO roomDTO);
        Task UpdateRoomAsync(int id, RoomDTO roomDTO);
        Task DeleteRoomAsync(int id);
    }
}
