using AutoMapper;
using Cinema_project_dotnet.BusinessLogic.Exeptions;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IFilmRepository _filmRepo;
        private readonly IMapper _mapper;

        public StatisticsService(IFilmRepository filmRepo, IMapper mapper)
        {
            _filmRepo = filmRepo;
            _mapper = mapper;
        }

        public async Task<List<FilmStatisticsDTO>> GetFilmStatisticsAsync()
        {
            var statistics = await _filmRepo.GetFilmStatisticsAsync();

            if (statistics == null || statistics.Count == 0)
            {
                throw new HttpException("No statistics found", HttpStatusCode.NotFound);
            }

            return _mapper.Map<List<FilmStatisticsDTO>>(statistics);
        }
    }

}
