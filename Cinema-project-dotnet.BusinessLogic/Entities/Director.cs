namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Director
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public List<FilmDirector> FilmDirectors { get; set; } = new List<FilmDirector>();
    }
}
