namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class FilmDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public decimal Rating { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; } = string.Empty;
        public string PosterUrl { get; set; } = string.Empty;
        public string TrailerUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>(); 
        public List<string> Directors { get; set; } = new List<string>();
    }
}
