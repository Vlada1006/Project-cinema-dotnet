using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class BookingService : IBookingService
    {
        private readonly IGenericRepository<Booking> _bookingRepo;
        private readonly IMapper _mapper;

        public BookingService(IGenericRepository<Booking> bookingRepo, IMapper mapper)
        {
            _bookingRepo = bookingRepo;
            _mapper = mapper;
        }

        public Task<List<BookingDTO>> GetAllBookingsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<BookingDTO> GetBookingByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task CreateBookingAsync(BookingDTO bookingDTO)
        {
            throw new NotImplementedException();
        }

        public Task UpdateBookingAsync(int id, BookingDTO bookingDTO)
        {
            throw new NotImplementedException();
        }

        public Task CancelBookingAsync(int id, string cancellationMessage)
        {
            throw new NotImplementedException();
        }
    }
}
