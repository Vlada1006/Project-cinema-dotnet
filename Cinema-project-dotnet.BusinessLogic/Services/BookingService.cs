using System.Data;
using System.Net;
using System.Runtime.InteropServices;
using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class BookingService : IBookingService
    {
        private readonly IGenericRepository<Booking> _bookingRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Session> _sessionRepo;
        private readonly IGenericRepository<Seat> _seatRepo;
        private readonly IGenericRepository<SessionSeat> _sessionSeatRepo;
        private readonly IGenericRepository<Transaction> _transactionRepo;
        private readonly IMapper _mapper;

        public BookingService(
            IGenericRepository<Booking> bookingRepo,
            IGenericRepository<User> userRepo,
            IGenericRepository<Session> sessionRepo,
            IGenericRepository<Seat> seatRepo,
            IGenericRepository<SessionSeat> sessionSeatRepo,
            IGenericRepository<Transaction> transactionRepo,
            IMapper mapper)
        {
            _bookingRepo = bookingRepo;
            _userRepo = userRepo;
            _sessionRepo = sessionRepo;
            _seatRepo = seatRepo;
            _sessionSeatRepo = sessionSeatRepo;
            _transactionRepo = transactionRepo;
            _mapper = mapper;
        }

        public async Task<List<BookingDTO>> GetAllBookingsAsync()
        {
            var bookings = await _bookingRepo.GetAllAsync();
            return _mapper.Map<List<BookingDTO>>(bookings);
        }

        public async Task<BookingDTO> GetBookingByIdAsync(int id)
        {
            var booking = await _bookingRepo.GetByIdAsync(id);

            if (booking == null)
            {
                throw new HttpException("Booking not found", HttpStatusCode.NotFound);
            }

            return _mapper.Map<BookingDTO>(booking);
        }

        public async Task CreateBookingAsync(BookingDTO bookingDTO)
        {
            var user = await _userRepo.GetByConditionAsync(u => u.Id == bookingDTO.UserId);
            if (user.Count() == 0)
            {
                throw new HttpException("User not found", HttpStatusCode.NotFound);
            }

            var session = await _sessionRepo.GetByIdAsync(bookingDTO.SessionId);
            if(session == null)
            {
                throw new HttpException("Session not found", HttpStatusCode.NotFound);
            }

            var seat = await _seatRepo.GetByIdAsync(bookingDTO.SeatId);
            if (seat == null)
            {
                throw new HttpException("Seat not found", HttpStatusCode.NotFound);
            }

            var transaction = await _transactionRepo.GetByIdAsync(bookingDTO.TransactionId);
            if (transaction == null)
            {
                throw new HttpException("Transaction not found", HttpStatusCode.NotFound);
            }

            var sessionSeatList = await _sessionSeatRepo
                .GetByConditionAsync(ss => ss.SessionId == bookingDTO.SessionId && ss.SeatId == bookingDTO.SeatId);

            var sessionSeat = sessionSeatList.First();

            if (sessionSeat.IsAvailable == false)
            {
                throw new HttpException("Seat not available", HttpStatusCode.Conflict);
            }

            var booking = _mapper.Map<Booking>(bookingDTO);

            sessionSeat.IsAvailable = false;

            await _sessionSeatRepo.UpdateAsync(sessionSeat);

            await _bookingRepo.AddAsync(booking);
        }

        public async Task UpdateBookingAsync(int id, BookingDTO bookingDTO)
        {
            var booking = await _bookingRepo.GetByIdAsync(id);
            if (booking == null)
            {
                throw new HttpException("Booking not found", HttpStatusCode.NotFound);
            }

            var user = await _userRepo.GetByConditionAsync(u => u.Id == bookingDTO.UserId);
            if (user.Count() == 0)
            {
                throw new HttpException("User not found", HttpStatusCode.NotFound);
            }

            var session = await _sessionRepo.GetByIdAsync(bookingDTO.SessionId);
            if (session == null)
            {
                throw new HttpException("Session not found", HttpStatusCode.NotFound);
            }

            var seat = await _seatRepo.GetByIdAsync(bookingDTO.SeatId);
            if (seat == null)
            {
                throw new HttpException("Seat not found", HttpStatusCode.NotFound);
            }

            var transaction = await _transactionRepo.GetByIdAsync(bookingDTO.TransactionId);
            if (transaction == null)
            {
                throw new HttpException("Transaction not found", HttpStatusCode.NotFound);
            }

            var sessionSeatList = await _sessionSeatRepo
                .GetByConditionAsync(ss => ss.SessionId == bookingDTO.SessionId && ss.SeatId == bookingDTO.SeatId);

            var sessionSeat = sessionSeatList.First();

            if (sessionSeat.IsAvailable == false)
            {
                throw new HttpException("Seat not available", HttpStatusCode.Conflict);
            }

            _mapper.Map(bookingDTO, booking);

            await _bookingRepo.UpdateAsync(booking);
        }

        public async Task CancelBookingAsync(int id, string cancellationMessage)
        {
            var booking = await _bookingRepo.GetByIdAsync(id);
            if (booking == null)
            {
                throw new HttpException("Booking not found", HttpStatusCode.NotFound);
            }

            await _bookingRepo.DeleteAsync(id);
        }

        public async Task<List<BookingDTO>> GetBookingsByUserIdAsync(string userId)
        {
            var bookings = await _bookingRepo.GetByConditionAsync(b => b.UserId == userId);

            if (bookings.Count() == 0)
            {
                throw new HttpException("No bookings found for this user", HttpStatusCode.NotFound);
            }

            return _mapper.Map<List<BookingDTO>>(bookings);
        }
    }
}
