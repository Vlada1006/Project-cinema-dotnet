using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using FluentValidation;
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

        [HttpPost]
        public async Task<ActionResult> CreatBooking([FromBody] BookingDTO bookingDTO)
        {
            var validationResult = await _validator.ValidateAsync(bookingDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _bookingService.CreateBookingAsync(bookingDTO);
            return Ok(new { message = "Booking successfully created" });
        }
    }
}
