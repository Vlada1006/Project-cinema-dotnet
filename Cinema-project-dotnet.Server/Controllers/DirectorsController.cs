using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.DTOs.FilmDTO;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorsController : ControllerBase
    {
        private readonly IDirectorService _directorService;

        public DirectorsController(IDirectorService directorService)
        {
            _directorService = directorService;
        }

        [HttpGet]
        public async Task<ActionResult<List<DirectorDTO>>> GetDirectors()
        {
            var directors = await _directorService.GetAllDirectorsAsync();
            return Ok(new { message = "Successfully retrieved all directors", data = directors });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DirectorDTO>> GetDirector(int id)
        {
            var director = await _directorService.GetDirectorByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved director with id {id}", data = director });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreatDirector([FromBody] DirectorDTO directorDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _directorService.CreateDirectorAsync(directorDTO);
            return Ok(new { message = "Director successfully created" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateDirector(int id, [FromBody] DirectorDTO directorDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _directorService.UpdateDirectorAsync(id, directorDTO);
            return Ok(new { message = $"Director with id {id} successfully updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteDirector(int id)
        {
            await _directorService.DeleteDirectorAsync(id);
            return Ok(new { message = $"Director  with id {id} successfully deleted" });
        }
    }
}
