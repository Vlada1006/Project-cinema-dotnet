namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Genre
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public List<FilmGenre> FilmGenres { get; set; } = new List<FilmGenre>();
    }
}
