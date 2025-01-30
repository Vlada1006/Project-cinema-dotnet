using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
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
        public async Task<ActionResult<List<FilmGetDTO>>> GetFilms()
        {
            try
            {
                var films = await _filmService.GetAllFilmsAsync();
                return Ok(new { message = "Successfully retrieved all films", data = films });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving all films", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FilmGetDTO>> GetFilm(int id) 
        {
            try
            {
                var film = await _filmService.GetFilmByIdAsync(id);
                return Ok(new { message = $"Successfully retrieved film with id {id}", data = film });
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = $"An error occurred while retrieving film with id {id}", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreatFilm([FromBody] FilmCreateUpdateDTO filmDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                await _filmService.CreateFilmAsync(filmDTO);
                return Ok(new { message = "Film successfully created" });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the film", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFilm(int id, [FromBody] FilmCreateUpdateDTO filmDTO)
        {
            if (!ModelState.IsValid)
            {
                var messages = ModelState.Values
                    .SelectMany(modelState => modelState.Errors)
                    .Select(err => err.ErrorMessage)
                    .ToList();

                return BadRequest(messages);
            }

            try
            {
                await _filmService.UpdateFilmAsync(id, filmDTO);
                return Ok(new { message = $"Film with id {id} successfully updated" });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating film with id {id}", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFilm(int id)
        {
            try
            {
                await _filmService.DeleteFilmAsync(id);
                return Ok(new { message = $"Film  with id {id} successfully deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while deleting film with id {id}", error = ex.Message });
            }
        }
    }
}
