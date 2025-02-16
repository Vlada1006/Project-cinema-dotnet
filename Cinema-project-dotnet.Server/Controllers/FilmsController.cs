using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase
    {
        private readonly IFilmService _filmService;
        private readonly ISessionService _sessionService;
        private readonly IBookingService _bookingService;
        private IHubContext<NotificationHub> _hubContext;

        public FilmsController(IFilmService filmService, ISessionService sessionService, IBookingService bookingService, IHubContext<NotificationHub> hubContext)
        {
            _filmService = filmService;
            _sessionService = sessionService;
            _bookingService = bookingService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<FilmGetDTO>>> GetFilms()
        {
            var films = await _filmService.GetAllFilmsAsync();
            return Ok(new { message = "Successfully retrieved all films", data = films });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FilmGetDTO>> GetFilm(int id) 
        {
            var film = await _filmService.GetFilmByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved film with id {id}", data = film });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreatFilm([FromBody] FilmCreateUpdateDTO filmDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _filmService.CreateFilmAsync(filmDTO);
            return Ok(new { message = "Film successfully created" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateFilm(int id, [FromBody] FilmCreateUpdateDTO filmDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _filmService.UpdateFilmAsync(id, filmDTO);
            return Ok(new { message = $"Film with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteFilm(int id)
        {
            var film = await _filmService.GetFilmByIdAsync(id);
            var sessions = await _sessionService.GetSessionsByFilmIdAsync(id); // You would need a service method for this
            var bookings = new List<BookingDTO>();
            foreach (var session in sessions)
            {
                bookings.AddRange(await _bookingService.GetBookingsBySessionIdAsync(session.Id));
            }

            await _filmService.DeleteFilmAsync(id);

            foreach (var booking in bookings)
            {
                await _hubContext.Clients.User(booking.UserId.ToString()).SendAsync("ReceiveNotification",
                    $"Your booking for the film '{film.Title}' has been canceled as the film has been deleted.");
            }

            return Ok(new { message = $"Film  with id {id} successfully deleted" });
        }
    }
}
