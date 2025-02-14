using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IValidator<BookingDTO> _validator;

        public BookingsController(IBookingService bookingService, IValidator<BookingDTO> validator)
        {
            _bookingService = bookingService;
            _validator = validator;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<BookingDTO>>> GetBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(new { message = "Successfully retrieved all bookings", data = bookings });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<BookingDTO>> GetBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved booking with id {id}", data = booking });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> CreatBooking([FromBody] BookingDTO bookingDTO)
        {
            var validationResult = await _validator.ValidateAsync(bookingDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _bookingService.CreateBookingAsync(bookingDTO);
            return Ok(new { message = "Booking successfully created" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBooking(int id, [FromBody] BookingDTO bookingDTO)
        {
            var validationResult = await _validator.ValidateAsync(bookingDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _bookingService.UpdateBookingAsync(id, bookingDTO);
            return Ok(new { message = $"Booking with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> CancelBooking(int id, string cancellationMessage)
        {
            await _bookingService.CancelBookingAsync(id, cancellationMessage);
            return Ok(new { message = $"Booking  with id {id} successfully canceled" });
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<BookingDTO>>> GetBookingsByUserId(string userId)
        {
            var bookings = await _bookingService.GetBookingsByUserIdAsync(userId);
            return Ok(new { message = $"Successfully retrieved bookings for user with id {userId}", data = bookings });
        }
    }
}
