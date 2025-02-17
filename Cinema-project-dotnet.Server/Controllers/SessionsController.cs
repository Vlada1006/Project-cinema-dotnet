using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly IValidator<SessionDTO> _validator;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IBookingService _bookingService;

        public SessionsController(ISessionService sessionService, IValidator<SessionDTO> validator, 
            IHubContext<NotificationHub> hubContext, IBookingService bookingService)
        {
            _sessionService = sessionService;
            _validator = validator;
            _hubContext = hubContext;
            _bookingService = bookingService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<SessionDTO>>> GetSessions()
        {
            var sessions = await _sessionService.GetAllSessionsAsync();
            return Ok(new { message = "Successfully retrieved all sessions", data = sessions });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<SessionDTO>> GetSession(int id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved session with id {id}", data = session });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreatSession([FromBody] SessionDTO sessionDTO)
        {
            var validationResult = await _validator.ValidateAsync(sessionDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _sessionService.CreateSessionAsync(sessionDTO);
            return Ok(new { message = "Session successfully created" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateSession(int id, [FromBody] SessionDTO sessionDTO)
        {
            var validationResult = await _validator.ValidateAsync(sessionDTO);
            if (!validationResult.IsValid) return BadRequest(validationResult);

            await _sessionService.UpdateSessionAsync(id, sessionDTO);
            return Ok(new { message = $"Session with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteSession(int id)
        {
            try
            {
                var bookings = await _bookingService.GetBookingsBySessionIdAsync(id);

                foreach (var booking in bookings)
                {
                    await _bookingService.CancelBookingAsync(booking.Id, "Session deleted");

                    await _hubContext.Clients.User(booking.UserId.ToString()).SendAsync("ReceiveNotification",
                        $"Your booking for session {id} has been canceled as the session has been deleted.");
                }

                await _sessionService.DeleteSessionAsync(id);

                return Ok(new { message = $"Session with id {id} successfully deleted with relation bookings" });
            }
            catch (HttpException ex)
            {
                await _sessionService.DeleteSessionAsync(id);

                return Ok(new { message = $"Session with id {id} successfully deleted" });
            }
        }

        [HttpGet("seats/{id}")]
        public async Task<ActionResult<List<SeatDTO>>> GetAllSeatsForSession(int id)
        {
            var seats = await _sessionService.GetAllSeatsForSessionAsync(id);
            return Ok(new { message = "Successfully retrieved all seats", data = seats });
        }
    }
}
