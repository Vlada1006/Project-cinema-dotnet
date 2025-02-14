using Cinema_project_dotnet.BusinessLogic.DTOs;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IBookingService
    {
        Task<List<BookingDTO>> GetAllBookingsAsync();
        Task<BookingDTO> GetBookingByIdAsync(int id);
        Task CreateBookingAsync(BookingDTO bookingDTO);
        Task UpdateBookingAsync(int id, BookingDTO bookingDTO);
        Task CancelBookingAsync(int id, string cancellationMessage);
        Task<List<BookingDTO>> GetBookingsByUserIdAsync(string userId);
    }
}
