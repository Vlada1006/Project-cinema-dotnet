using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/statistics")]
public class StatisticsController : ControllerBase
{
    private readonly IFilmService _filmService;

    public StatisticsController(IFilmService filmService)
    {
        _filmService = filmService;
    }

    [HttpGet]
    public async Task<ActionResult<List<FilmStatisticsDTO>>> GetFilmStatistics()
    {
        var statistics = await _filmService.GetFilmStatisticsAsync();
        return Ok(statistics);
    }
}
