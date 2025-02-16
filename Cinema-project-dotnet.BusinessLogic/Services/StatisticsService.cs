using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class StatisticsService
    {
        private readonly IFilmService _filmService;

        public StatisticsService(IFilmService filmService)
        {
            _filmService = filmService;
        }

        public async Task<List<FilmStatisticsDTO>> GetFilmStatisticsAsync(DateTime? startDate, DateTime? endDate)
        {
            var statistics = await _filmService.GetFilmStatisticsAsync(startDate, endDate);

            if (statistics == null || !statistics.Any())
            {
                throw new HttpException("No statistics found for the given date range", HttpStatusCode.NotFound);
            }

            return statistics;
        }
    }
}
