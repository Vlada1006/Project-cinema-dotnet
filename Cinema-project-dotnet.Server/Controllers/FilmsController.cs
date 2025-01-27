using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase
    {
        private readonly IFilmService _filmService;

        public FilmsController(IFilmService filmService)
        {
            _filmService = filmService;
        }

        [HttpGet]
        public async Task<ActionResult<List<FilmDTO>>> GetFilms()
        {
            var films = await _filmService.GetAllFilmsAsync();
            return Ok(films);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FilmDTO>> GetFilm(int id) 
        {
            try
            {
                var film = await _filmService.GetFilmByIdAsync(id);
                return Ok(film);
            }
            catch (KeyNotFoundException) 
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<FilmDTO>> CreatFilm([FromBody] FilmDTO filmDTO)
        {
            var createdFilm = await _filmService.CreateFilmAsync(filmDTO);
            return Ok(createdFilm);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FilmDTO>> UpdateFilm(int id, [FromBody] FilmDTO filmDTO)
        {
            if (!ModelState.IsValid) return BadRequest();

            var updatedFilm = await _filmService.UpdateFilmAsync(id, filmDTO);

            return Ok(updatedFilm);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFilm(int id)
        {
            try
            {
                await _filmService.DeleteFilmAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
