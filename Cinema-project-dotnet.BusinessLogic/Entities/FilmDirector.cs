namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class FilmDirector
    {
        public int FilmId { get; set; }
        public Film Film { get; set; }
        public int DirectorId { get; set; }
        public Director Director { get; set; }
    }
}
