using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<List<FilmGetDTO>>> GetFilms()
        {
            var films = await _filmService.GetAllFilmsAsync();
            return Ok(new { message = "Successfully retrieved all films", data = films });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
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
            await _filmService.DeleteFilmAsync(id);
            return Ok(new { message = $"Film  with id {id} successfully deleted" });
        }
    }
}
