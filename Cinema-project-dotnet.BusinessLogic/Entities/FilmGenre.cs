﻿namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class FilmGenre
    {
        public int FilmId { get; set; }
        public Film Film { get; set; }
        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}
