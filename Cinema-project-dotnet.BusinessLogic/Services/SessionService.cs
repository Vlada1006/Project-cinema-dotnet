using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Net;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class SessionService : ISessionService
    {
        private readonly IGenericRepository<Session> _sessionRepo;
        private readonly IGenericRepository<Film> _filmRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IGenericRepository<SessionSeat> _sessionSeatRepo;
        private readonly IGenericRepository<Seat> _seatRepo;
        private readonly IMapper _mapper;

        public SessionService(
            IGenericRepository<Session> sessionRepo,
            IGenericRepository<Film> filmRepo,
            IGenericRepository<Room> roomRepo,
            IGenericRepository<SessionSeat> sessionSeatRepo,
            IGenericRepository<Seat> seatRepo,
            IMapper mapper)
        {
            _sessionRepo = sessionRepo;
            _filmRepo = filmRepo;
            _roomRepo = roomRepo;
            _sessionSeatRepo = sessionSeatRepo;
            _seatRepo = seatRepo;
            _mapper = mapper;
        }

        public async Task<List<SessionDTO>> GetAllSessionsAsync()
        {
            var sessions = await _sessionRepo.GetAllAsync();
            return _mapper.Map<List<SessionDTO>>(sessions);
        }

        public async Task<SessionDTO> GetSessionByIdAsync(int id)
        {
            var session = await _sessionRepo.GetByIdAsync(id);

            if (session == null)
            {
                throw new HttpException("Session not found", HttpStatusCode.NotFound);
            }

            return _mapper.Map<SessionDTO>(session);
        }

        public async Task CreateSessionAsync(SessionDTO sessionDTO)
        {
            var conflictingSession = await GetConflictingSessionAsync(
                                            sessionDTO.RoomId,
                                            sessionDTO.StartTime,
                                            sessionDTO.EndTime);

            if (conflictingSession.Count() != 0)
            {
                throw new HttpException("A session already exists during the selected time range in this room.", HttpStatusCode.Conflict);
            }

            var film = await _filmRepo.GetByIdAsync(sessionDTO.FilmId);
            if(film == null)
            {
                throw new HttpException("Film not found", HttpStatusCode.NotFound);
            }

            var room = await _roomRepo.GetByIdAsync(sessionDTO.RoomId);
            if (room == null)
            {
                throw new HttpException("Room not found", HttpStatusCode.NotFound);
            }

            var session = _mapper.Map<Session>(sessionDTO);
            await _sessionRepo.AddAsync(session);

            var seats = await _seatRepo.GetByConditionAsync(s => s.RoomId == sessionDTO.RoomId);

            var sessionSeats = seats.Select(seat => new SessionSeat
            {
                SessionId = session.Id,
                SeatId = seat.Id,
                IsAvailable = true 
            }).ToList();

            await _sessionSeatRepo.AddRangeAsync(sessionSeats);
        }

        public async Task UpdateSessionAsync(int id, SessionDTO sessionDTO)
        {
            var session = await _sessionRepo.GetByIdAsync(id);
            if (session == null)
            {
                throw new HttpException("Session not found", HttpStatusCode.NotFound);
            }

            bool timeChanged = session.StartTime != sessionDTO.StartTime || session.EndTime != sessionDTO.EndTime;

            if (timeChanged)
            {
                var conflictingSession = await GetConflictingSessionAsync(
                    sessionDTO.RoomId,
                    sessionDTO.StartTime,
                    sessionDTO.EndTime);

                if (conflictingSession.Count() != 0)
                {
                    throw new HttpException("A session already exists during the selected time range in this room.", HttpStatusCode.Conflict);
                }
            }

            var film = await _filmRepo.GetByIdAsync(sessionDTO.FilmId);
            if (film == null)
            {
                throw new HttpException("Film not found", HttpStatusCode.NotFound);
            }

            var room = await _roomRepo.GetByIdAsync(sessionDTO.RoomId);
            if (room == null)
            {
                throw new HttpException("Room not found", HttpStatusCode.NotFound);
            }

            _mapper.Map(sessionDTO, session);

            await _sessionRepo.UpdateAsync(session);
        }

        public async Task DeleteSessionAsync(int id)
        {
            var session = await _sessionRepo.GetByIdAsync(id);

            if (session == null)
            {
                throw new HttpException("Session not found", HttpStatusCode.NotFound);
            }

            await _sessionRepo.DeleteAsync(id);
        }

        private async Task<IEnumerable<Session>> GetConflictingSessionAsync(int roomId, DateTime startTime, DateTime endTime)
        {
            return await _sessionRepo.GetByConditionAsync(s => s.RoomId == roomId &&
                            ((startTime >= s.StartTime && startTime < s.EndTime) ||
                             (endTime > s.StartTime && endTime <= s.EndTime) ||
                             (startTime <= s.StartTime && endTime >= s.EndTime)));
        }
    }
}
