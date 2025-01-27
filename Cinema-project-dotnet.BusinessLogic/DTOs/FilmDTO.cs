namespace Cinema_project_dotnet.BusinessLogic.DTOs
{
    public class FilmDTO
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
        public List<FilmGenreDTO> FilmGenres { get; set; } = new List<FilmGenreDTO>();
        public List<FilmDirectorDTO> FilmDirectors { get; set; } = new List<FilmDirectorDTO>();
    }
}
