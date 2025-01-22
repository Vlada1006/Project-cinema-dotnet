namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Film
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        public decimal Rating { get; set; }

        public int Duration { get; set; }

        public string Language { get; set; } = string.Empty;

        public string PosterUrl { get; set; } = string.Empty;

        public string TrailerUrl { get; set; } = string.Empty;

        public List<Genre> Genres { get; set; } = new List<Genre>();

        public List<Director> Directors { get; set; } = new List<Director>();

        public List<Session> Sessions { get; set; } = new List<Session>();
    }
}
