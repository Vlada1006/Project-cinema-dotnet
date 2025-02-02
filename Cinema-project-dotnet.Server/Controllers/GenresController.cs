using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenresController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenresController(IGenreService genreService)
        {
            _genreService = genreService;
        }

        [HttpGet]
        public async Task<ActionResult<List<GenreDTO>>> GetGenres()
        {
            var genres = await _genreService.GetAllGenrsAsync();
            return Ok(new { message = "Successfully retrieved all genres", data = genres });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GenreDTO>> GetGenre(int id)
        {
            var genre = await _genreService.GetGenreByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved genre with id {id}", data = genre });
        }

        [HttpPost]
        public async Task<ActionResult> CreatGenre([FromBody] GenreDTO genreDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _genreService.CreateGenreAsync(genreDTO);
            return Ok(new { message = "Genre successfully created" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateGenre(int id, [FromBody] GenreDTO genreDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _genreService.UpdateGenreAsync(id, genreDTO);
            return Ok(new { message = $"Genre with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGenre(int id)
        {
            await _genreService.DeleteGenreAsync(id);
            return Ok(new { message = $"Genre  with id {id} successfully deleted" });
        }
    }
}
