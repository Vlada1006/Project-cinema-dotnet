using Cinema_project_dotnet.BusinessLogic.DTOs.RoomDTO;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IRoomService
    {
        Task<List<RoomGetDTO>> GetAllRoomsAsync();
        Task<RoomGetDTO> GetRoomByIdAsync(int id);
        Task CreateRoomAsync(RoomCreatUpdateDTO roomDTO);
        Task UpdateRoomAsync(int id, RoomCreatUpdateDTO roomDTO);
        Task DeleteRoomAsync(int id);
    }
}
