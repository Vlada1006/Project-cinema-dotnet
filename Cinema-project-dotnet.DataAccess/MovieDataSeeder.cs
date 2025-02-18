using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Newtonsoft.Json;

namespace Cinema_project_dotnet.DataAccess
{
    public class MovieDataSeeder
    {
        private readonly IGenericRepository<Film> _filmRepository;
        private readonly IGenericRepository<Genre> _genreRepository;
        private readonly IGenericRepository<Director> _directorRepository;

        public MovieDataSeeder(IGenericRepository<Film> filmRepository, IGenericRepository<Genre> genreRepository, IGenericRepository<Director> directorRepository)
        {
            _filmRepository = filmRepository;
            _genreRepository = genreRepository;
            _directorRepository = directorRepository;
        }

        public async Task SeedDatabaseAsync()
        {
            var films = await _filmRepository.GetAllAsync();
            if (films.Any())
            {
                return; 
            }

            var movieData = await LoadMovieDataFromFileAsync("movie_details_with_trailers.json");

            foreach (var movie in movieData)
            {
                if (movie.ReleaseDate.Kind == DateTimeKind.Unspecified)
                {
                    movie.ReleaseDate = DateTime.SpecifyKind(movie.ReleaseDate, DateTimeKind.Utc);
                }
                else if (movie.ReleaseDate.Kind == DateTimeKind.Local)
                {
                    movie.ReleaseDate = movie.ReleaseDate.ToUniversalTime();
                }
                var film = new Film
                {
                    Title = movie.Title,
                    Description = movie.Description,
                    ReleaseDate = movie.ReleaseDate,
                    Rating = movie.Rating,
                    Duration = movie.Duration,
                    Language = movie.Language,
                    PosterUrl = movie.PosterUrl,
                    TrailerUrl = movie.TrailerUrl,
                };

                foreach (var genreData in movie.Genres)
                {
                    var genre = await _genreRepository.GetByConditionAsync(g => g.Name == genreData.Name);
                    if (!genre.Any())
                    {
                        var newGenre = new Genre { Name = genreData.Name };
                        await _genreRepository.AddAsync(newGenre);
                        genre = new List<Genre> { newGenre };
                    }
                    film.FilmGenres.Add(new FilmGenre { Film = film, Genre = genre.First() });
                }

                foreach (var directorData in movie.Directors)
                {
                    var director = await _directorRepository.GetByConditionAsync(d => d.Name == directorData.Name);
                    if (!director.Any())
                    {
                        var newDirector = new Director { Name = directorData.Name };
                        await _directorRepository.AddAsync(newDirector);
                        director = new List<Director> { newDirector };
                    }
                    film.FilmDirectors.Add(new FilmDirector { Film = film, Director = director.First() });
                }

                await _filmRepository.AddAsync(film);
            }
        }

        private async Task<List<MovieJson>> LoadMovieDataFromFileAsync(string fileName)
        {
            var jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), fileName);

            if (!File.Exists(jsonFilePath))
            {
                throw new FileNotFoundException($"File {fileName} did not found wiht path: {jsonFilePath}");
            }

            var json = await File.ReadAllTextAsync(jsonFilePath);
            var movieData = JsonConvert.DeserializeObject<List<MovieJson>>(json);
            return movieData;
        }
    }

    public class MovieJson
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public decimal Rating { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; }
        public string PosterUrl { get; set; }
        public string TrailerUrl { get; set; }
        public List<GenreJson> Genres { get; set; }
        public List<DirectorJson> Directors { get; set; }
    }

    public class GenreJson
    {
        public string Name { get; set; }
    }

    public class DirectorJson
    {
        public string Name { get; set; }
    }
}
