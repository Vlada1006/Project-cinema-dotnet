namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Room
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int TotalSeats { get; set; }

        public string Type { get; set; } = string.Empty;

        public int Rows { get; set; }

        public int SeatsPerRow { get; set; }

        public List<Session> Sessions { get; set; } = new List<Session>();

        public List<Seat> Seats { get; set; } = new List<Seat>();
    }
}
