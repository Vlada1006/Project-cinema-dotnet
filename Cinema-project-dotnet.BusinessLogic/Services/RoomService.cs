using System.Net;
using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class RoomService : IRoomService
    {
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IGenericRepository<Seat> _seatRepo;
        private readonly IGenericRepository<Booking> _bookingRepo;
        private readonly IMapper _mapper;

        public RoomService(
            IGenericRepository<Room> roomRepo,
            IGenericRepository<Seat> seatRepo,
            IGenericRepository<Booking> bookingRepo,
            IMapper mapper)
        {
            _roomRepo = roomRepo;
            _seatRepo = seatRepo;
            _bookingRepo = bookingRepo;
            _mapper = mapper;
        }

        public async Task<List<RoomDTO>> GetAllRoomsAsync()
        {
            var room = await _roomRepo.GetAllAsync();
            return _mapper.Map<List<RoomDTO>>(room);
        }

        public async Task<RoomDTO> GetRoomByIdAsync(int id)
        {
            var room = await _roomRepo.GetByIdAsync(id);

            if (room == null)
            {
                throw new HttpException("Room not found", HttpStatusCode.NotFound);
            }
            
            return _mapper.Map<RoomDTO>(room);
        }

        public async Task CreateRoomAsync(RoomDTO roomDTO)
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
                        Room = room
                    });
                }
            }

            await _roomRepo.AddAsync(room);
        }

        public async Task UpdateRoomAsync(int id, RoomDTO roomDTO)
        {
            var room = await _roomRepo.GetByIdAsync(id, query => query
                .Include(f => f.Seats));

            if (room == null)
                throw new Exception("Room not found.");

            room.Seats.Clear();

            var newSeats = new List<Seat>();
            var newRows = roomDTO.Rows;
            var newSeatsPerRow = roomDTO.SeatsPerRow;

            for (int row = 1; row <= newRows; row++)
            {
                for (int seatNumber = 1; seatNumber <= newSeatsPerRow; seatNumber++)
                {
                    var seat = new Seat
                    {
                        Row = row,
                        Number = seatNumber,
                        Room = room,
                    };
                    newSeats.Add(seat);
                }
            }

            room.Seats = newSeats;
            _mapper.Map(roomDTO, room);

            await _roomRepo.UpdateAsync(room);
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
