using System.Net;
using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.RoomDTO;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class RoomService : IRoomService
    {
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IMapper _mapper;

        public RoomService(IGenericRepository<Room> roomRepo, IMapper mapper)
        {
            _roomRepo = roomRepo;
            _mapper = mapper;
        }

        public Task<List<RoomGetDTO>> GetAllRoomsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<RoomGetDTO> GetRoomByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task CreateRoomAsync(RoomCreatUpdateDTO roomDTO)
        {
            var room = _mapper.Map<Room>(roomDTO);

            for (int row = 1; row <= roomDTO.Rows; row++)
            {
                for (int number = 1; number <= roomDTO.SeatsPerRow; number++)
                {
                    room.Seats.Add(new Seat
                    {
                        Row = row,
                        Number = number,
                        IsAvailable = true,
                        Room = room
                    });
                }
            }

            await _roomRepo.AddAsync(room);
        }

        public async Task UpdateRoomAsync(int id, RoomCreatUpdateDTO roomDTO)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteRoomAsync(int id)
        {
            var room = await _roomRepo.GetByIdAsync(id);

            if(room == null)
            {
                throw new HttpException("Room not found", HttpStatusCode.NotFound);
            }

            await _roomRepo.DeleteAsync(room);
        }
    }
}
