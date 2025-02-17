using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class FilmStatisticsDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int TicketsSold { get; set; }
        public decimal Revenue { get; set; }
    }
}
